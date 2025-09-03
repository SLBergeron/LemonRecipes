import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ShoppingCart, Plus, Check, Trash2, Package } from "lucide-react"
import { useShoppingList } from '@/hooks/useShoppingList'
import { useWeeklyPlan } from '@/hooks/useWeeklyPlan'
import { useSimpleRecipes } from '@/hooks/useSimpleRecipes'
import { useSimplePantry } from '@/hooks/useSimplePantry'
import { DEFAULT_CATEGORIES, COMMON_UNITS } from '@/types/simple'
import type { ShoppingItem } from '@/types/simple'

export function ShoppingListView() {
  const { pantry } = useSimplePantry()
  const { recipes } = useSimpleRecipes(pantry)
  const { currentPlan } = useWeeklyPlan(recipes, pantry)
  const {
    shoppingList,
    loading,
    error,
    toggleItemChecked,
    addCustomItem,
    removeItem,
    updateItemQuantity,
    getItemsByCategory,
    getUncheckedItems,
    getCheckedItems,
    getStats,
    clearCheckedItems
  } = useShoppingList(currentPlan, recipes, pantry)

  const [showAddForm, setShowAddForm] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  
  const [newItem, setNewItem] = useState({
    name: '',
    amount: 1,
    unit: 'items',
    category: 'pantry'
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Generating shopping list...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <ShoppingCart className="h-12 w-12 mx-auto text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  if (!shoppingList) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No shopping list available</p>
        <p className="text-sm text-muted-foreground mt-2">
          Plan some meals for this week to generate a shopping list
        </p>
      </div>
    )
  }

  const stats = getStats()
  const displayItems = showCompleted 
    ? getCheckedItems() 
    : filterCategory === 'all'
      ? getUncheckedItems()
      : getItemsByCategory(filterCategory)

  const handleAddCustomItem = async () => {
    if (!newItem.name.trim()) return
    
    try {
      await addCustomItem(newItem.name, newItem.amount, newItem.unit, newItem.category)
      setNewItem({ name: '', amount: 1, unit: 'items', category: 'pantry' })
      setShowAddForm(false)
    } catch (err) {
      console.error('Failed to add custom item:', err)
    }
  }

  const handleToggleItem = async (itemId: string) => {
    try {
      await toggleItemChecked(itemId)
    } catch (err) {
      console.error('Failed to toggle item:', err)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    if (confirm('Remove this item from your shopping list?')) {
      try {
        await removeItem(itemId)
      } catch (err) {
        console.error('Failed to remove item:', err)
      }
    }
  }

  const handleClearCompleted = async () => {
    if (confirm('Remove all checked items from your shopping list?')) {
      try {
        await clearCheckedItems()
      } catch (err) {
        console.error('Failed to clear completed items:', err)
      }
    }
  }

  const groupedItems = displayItems.reduce((groups, item) => {
    const category = item.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
    return groups
  }, {} as Record<string, ShoppingItem[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Shopping List</h2>
          <p className="text-muted-foreground">
            Generated from your weekly meal plan • {stats.progress}% complete
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddForm(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
          {stats.checkedItems > 0 && (
            <Button onClick={handleClearCompleted} variant="outline">
              Clear Completed ({stats.checkedItems})
            </Button>
          )}
        </div>
      </div>

      {/* Stats and Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.checkedItems}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {stats.totalItems > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Shopping Progress</span>
                <span>{stats.progress}%</span>
              </div>
              <Progress value={stats.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {DEFAULT_CATEGORIES.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.emoji} {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant={showCompleted ? "default" : "outline"}
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? 'Show Active' : `Show Completed (${stats.checkedItems})`}
          </Button>
        </div>
      </div>

      {/* Add Custom Item Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Custom Item</CardTitle>
            <CardDescription>Add an item to your shopping list</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Name</Label>
                <Input
                  id="item-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Bananas"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-category">Category</Label>
                <Select 
                  value={newItem.category} 
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_CATEGORIES.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.emoji} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-amount">Amount</Label>
                <Input
                  id="item-amount"
                  type="number"
                  min="1"
                  step="0.1"
                  value={newItem.amount}
                  onChange={(e) => setNewItem(prev => ({ ...prev, amount: parseFloat(e.target.value) || 1 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-unit">Unit</Label>
                <Select 
                  value={newItem.unit} 
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_UNITS.map(unit => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddCustomItem} disabled={!newItem.name.trim()}>
                Add Item
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shopping List */}
      <div className="space-y-4">
        {Object.keys(groupedItems).length > 0 ? (
          Object.entries(groupedItems).map(([categoryId, items]) => {
            const category = DEFAULT_CATEGORIES.find(cat => cat.id === categoryId)
            
            return (
              <Card key={categoryId}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{category?.emoji || '📦'}</span>
                    {category?.name || categoryId}
                    <Badge variant="secondary">{items.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.map(item => (
                      <ShoppingItemRow
                        key={item.id}
                        item={item}
                        onToggle={handleToggleItem}
                        onRemove={handleRemoveItem}
                        onUpdateQuantity={updateItemQuantity}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {showCompleted ? 'No completed items' : 'Your shopping list is empty'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface ShoppingItemRowProps {
  item: ShoppingItem
  onToggle: (itemId: string) => void
  onRemove: (itemId: string) => void
  onUpdateQuantity: (itemId: string, newAmount: number) => void
}

function ShoppingItemRow({ item, onToggle, onRemove, onUpdateQuantity }: ShoppingItemRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editAmount, setEditAmount] = useState(item.amount.toString())

  const handleSave = () => {
    const newAmount = parseFloat(editAmount)
    if (!isNaN(newAmount) && newAmount > 0) {
      onUpdateQuantity(item.id, newAmount)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditAmount(item.amount.toString())
    setIsEditing(false)
  }

  return (
    <div className={`flex items-center justify-between p-3 border rounded-lg ${
      item.checked ? 'bg-green-50 border-green-200' : ''
    }`}>
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => onToggle(item.id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
            item.checked 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {item.checked && <Check className="h-3 w-3" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-20 h-8 text-sm"
                  step="0.1"
                  min="0"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave()
                    if (e.key === 'Escape') handleCancel()
                  }}
                  autoFocus
                />
                <span>{item.unit} {item.name}</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={handleSave} className="h-6 w-6 p-0">
                    <Check className="h-3 w-3 text-green-600" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancel} className="h-6 w-6 p-0">
                    <Trash2 className="h-3 w-3 text-gray-400" />
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="hover:bg-gray-100 px-1 py-0.5 rounded"
              >
                {item.amount} {item.unit} {item.name}
              </button>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Needed for: {item.needed_for.join(', ')}
          </div>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onRemove(item.id)}
        className="text-destructive hover:text-destructive flex-shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}