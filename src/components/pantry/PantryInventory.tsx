import { useState } from 'react'
import type { PantryInventory as PantryInventoryType, PantryCategory, PantryItem } from '@/types/pantry'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, AlertTriangle, Settings } from 'lucide-react'
import { PantryItemCard } from './PantryItemCard'
import { AddItemModal } from './AddItemModal'
import { EditItemModal } from './EditItemModal'
import { AddCategoryModal } from './AddCategoryModal'
import { EditCategoryModal } from './EditCategoryModal'
import { usePantryInventory } from '@/hooks/usePantryInventory'

interface PantryInventoryProps {
  pantry: PantryInventoryType
}


interface PantryCategoryProps {
  category: PantryCategory
  onEditItem: (item: PantryItem) => void
  onDeleteItem: (itemId: string) => void
  onUpdateAmount: (itemId: string, newAmount: string) => void
  onEditCategory: (category: PantryCategory) => void
  showManagementActions: boolean
}

function PantryCategoryCard({ 
  category, 
  onEditItem, 
  onDeleteItem, 
  onUpdateAmount, 
  onEditCategory,
  showManagementActions 
}: PantryCategoryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{category.emoji}</span>
            <span>{category.title}</span>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              {category.items.length}
            </span>
          </div>
          {showManagementActions && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEditCategory(category)}
              className="h-6 w-6 p-0"
            >
              <Settings className="h-3 w-3" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {category.items.map((item) => (
          <PantryItemCard
            key={item.id}
            item={item}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
            onUpdateAmount={onUpdateAmount}
            showManagementActions={showManagementActions}
          />
        ))}
      </CardContent>
    </Card>
  )
}

export function PantryInventory({ pantry }: PantryInventoryProps) {
  const [showManagementActions, setShowManagementActions] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<PantryCategory | null>(null)

  const {
    addItem,
    updateItem,
    deleteItem,
    updateItemAmount,
    addCategory,
    updateCategory,
    removeCategory,
    notifications,
    clearNotification,
    loading
  } = usePantryInventory()

  const totalItems = pantry.categories.reduce((sum, cat) => sum + cat.items.length, 0)
  const lowStockItems = pantry.categories
    .flatMap(cat => cat.items)
    .filter(item => {
      if (item.unit === '%') {
        return parseInt(item.current_amount.replace('%', '')) < 30
      }
      const current = parseInt(item.current_amount.replace(/[^0-9]/g, ''))
      const total = parseInt(item.total_capacity.replace(/[^0-9]/g, ''))
      return (current / total) < 0.3
    })

  const handleEditItem = (item: PantryItem) => {
    setSelectedItem(item)
    setShowEditModal(true)
  }

  const handleDeleteItem = async (itemId: string) => {
    await deleteItem(itemId)
  }

  const handleUpdateItemAmount = async (itemId: string, newAmount: string) => {
    await updateItemAmount(itemId, newAmount)
  }

  const handleEditCategory = (category: PantryCategory) => {
    setSelectedCategory(category)
    setShowEditCategoryModal(true)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    await removeCategory(categoryId)
  }

  return (
    <div className="space-y-4">
      {/* Notifications */}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-3 rounded-md border ${
            notification.type === 'sync_success' ? 'bg-green-50 border-green-200 text-green-800' :
            notification.type === 'sync_conflict' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm">{notification.message}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => clearNotification(notification.id)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Pantry Inventory</h2>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(pantry.last_updated).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{totalItems}</p>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{lowStockItems.length}</p>
            <p className="text-xs text-muted-foreground">Low Stock</p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={showManagementActions ? 'default' : 'outline'}
              onClick={() => setShowManagementActions(!showManagementActions)}
            >
              <Settings className="w-4 h-4 mr-1" />
              {showManagementActions ? 'Done' : 'Manage'}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddCategoryModal(true)}
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-1" />
              Category
            </Button>
            
            <Button
              size="sm"
              variant="lemon"
              onClick={() => setShowAddModal(true)}
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>
        </div>
      </div>
      
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <h3 className="font-medium text-sm text-orange-800">Low Stock Alert</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map(item => (
                <span key={item.id} className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded-full border border-orange-300">
                  {item.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pantry.categories.map((category) => (
          <PantryCategoryCard
            key={category.id}
            category={category}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onUpdateAmount={handleUpdateItemAmount}
            onEditCategory={handleEditCategory}
            showManagementActions={showManagementActions}
          />
        ))}
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddItem={addItem}
        categories={pantry.categories}
        loading={loading}
      />

      {/* Edit Item Modal */}
      <EditItemModal
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open)
          if (!open) setSelectedItem(null)
        }}
        onUpdateItem={updateItem}
        onDeleteItem={handleDeleteItem}
        item={selectedItem}
        categories={pantry.categories}
        loading={loading}
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        open={showAddCategoryModal}
        onOpenChange={setShowAddCategoryModal}
        onAddCategory={addCategory}
        loading={loading}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        open={showEditCategoryModal}
        onOpenChange={(open) => {
          setShowEditCategoryModal(open)
          if (!open) setSelectedCategory(null)
        }}
        onUpdateCategory={updateCategory}
        onDeleteCategory={handleDeleteCategory}
        category={selectedCategory}
        loading={loading}
      />
    </div>
  )
}