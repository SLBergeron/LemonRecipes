import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Package, AlertTriangle, Check, ChevronDown, Edit3, ShoppingCart } from "lucide-react"
import { useSimplePantry } from '@/hooks/useSimplePantry'
import { DEFAULT_CATEGORIES, COMMON_UNITS } from '@/types/simple'
import type { SimplePantryItem } from '@/types/simple'

export function SimplePantryView() {
  const { 
    pantry, 
    loading, 
    error, 
    addItem, 
    updateItemAmount, 
    updateItemUnit,
    updateItemRestockLevel,
    updateItemAutoShopping,
    deleteItem, 
    getItemsByCategory, 
    getLowStockItems, 
    getStats 
  } = useSimplePantry()

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    amount: 1,
    unit: 'items',
    categoryId: 'pantry'
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Package className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading pantry...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  if (!pantry) return null

  const stats = getStats()
  const lowStockItems = getLowStockItems()
  const displayItems = selectedCategory === 'all'
    ? getItemsByCategory()
    : getItemsByCategory(selectedCategory)

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return
    
    try {
      await addItem(newItem.name, newItem.amount, newItem.unit, newItem.categoryId)
      setNewItem({ name: '', amount: 1, unit: 'items', categoryId: 'pantry' })
      setShowAddForm(false)
    } catch (err) {
      console.error('Failed to add item:', err)
    }
  }


  const handleDirectUpdateAmount = async (itemId: string, newAmount: number) => {
    if (newAmount < 0) return
    try {
      await updateItemAmount(itemId, newAmount)
    } catch (err) {
      console.error('Failed to update amount:', err)
    }
  }

  const handleUpdateUnit = async (itemId: string, newUnit: string) => {
    try {
      await updateItemUnit(itemId, newUnit)
    } catch (err) {
      console.error('Failed to update unit:', err)
    }
  }

  const handleUpdateRestockLevel = async (itemId: string, newLevel: number) => {
    try {
      await updateItemRestockLevel(itemId, newLevel)
    } catch (err) {
      console.error('Failed to update restock level:', err)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Remove this item from your pantry?')) {
      try {
        await deleteItem(itemId)
      } catch (err) {
        console.error('Failed to delete item:', err)
      }
    }
  }

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white rounded-lg border p-3">
          <div className="text-lg sm:text-2xl font-bold">{stats.totalItems}</div>
          <p className="text-xs sm:text-sm text-muted-foreground">Total Items</p>
        </div>
        <div className="bg-white rounded-lg border p-3">
          <div className="text-lg sm:text-2xl font-bold">{stats.categories}</div>
          <p className="text-xs sm:text-sm text-muted-foreground">Categories</p>
        </div>
        <div className="bg-white rounded-lg border p-3">
          <div className="text-lg sm:text-2xl font-bold text-destructive">{stats.lowStockCount}</div>
          <p className="text-xs sm:text-sm text-muted-foreground">Low Stock</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <h3 className="font-medium text-orange-800">Low Stock Items</h3>
          </div>
          <div className="flex flex-wrap gap-1">
            {lowStockItems.map(item => (
              <Badge key={item.id} variant="outline" className="border-orange-300 text-orange-800 text-xs">
                {item.name}: {item.current_amount} {item.unit}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
        </div>
        
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border p-4">
          <div className="mb-4">
            <h3 className="font-medium">Add New Item</h3>
            <p className="text-sm text-muted-foreground">Add an item to your pantry inventory</p>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="item-name" className="text-sm">Name</Label>
                <Input
                  id="item-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Olive Oil"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="item-category" className="text-sm">Category</Label>
                <Select 
                  value={newItem.categoryId} 
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger className="mt-1">
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="item-amount" className="text-sm">Amount</Label>
                <Input
                  id="item-amount"
                  type="number"
                  min="0"
                  step="0.1"
                  value={newItem.amount}
                  onChange={(e) => setNewItem(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="item-unit" className="text-sm">Unit</Label>
                <Select 
                  value={newItem.unit} 
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger className="mt-1">
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

            <div className="flex gap-2 pt-2">
              <Button onClick={handleAddItem} disabled={!newItem.name.trim()} size="sm">
                Add Item
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-4">
        {pantry.categories.map(category => {
          const categoryItems = selectedCategory === 'all' 
            ? category.items
            : (selectedCategory === category.id ? category.items : [])

          if (categoryItems.length === 0) return null

          return (
            <div key={category.id} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="text-lg">{category.emoji}</span>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <Badge variant="secondary" className="text-xs">{categoryItems.length}</Badge>
              </div>
              <div className="space-y-2">
                {categoryItems.map(item => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onUpdateDirectAmount={handleDirectUpdateAmount}
                    onUpdateUnit={handleUpdateUnit}
                    onUpdateRestockLevel={handleUpdateRestockLevel}
                    onUpdateAutoShopping={updateItemAutoShopping}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {displayItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {selectedCategory ? 'No items in this category' : 'Your pantry is empty'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Add your first item to get started!
          </p>
        </div>
      )}
    </div>
  )
}

interface ItemRowProps {
  item: SimplePantryItem
  onUpdateDirectAmount: (itemId: string, newAmount: number) => void
  onUpdateUnit: (itemId: string, newUnit: string) => void
  onUpdateRestockLevel: (itemId: string, newLevel: number) => void
  onUpdateAutoShopping: (itemId: string, autoShopping: boolean) => void
  onDelete: (itemId: string) => void
}

function ItemRow({ item, onUpdateDirectAmount, onUpdateUnit, onUpdateRestockLevel, onUpdateAutoShopping, onDelete }: ItemRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [isEditingAmount, setIsEditingAmount] = useState(false)
  const [isEditingUnit, setIsEditingUnit] = useState(false)
  const [isEditingRestock, setIsEditingRestock] = useState(false)
  const [editAmount, setEditAmount] = useState(item.current_amount.toString())
  const [editUnit, setEditUnit] = useState(item.unit)
  const [editRestock, setEditRestock] = useState((item.normal_restock_level || 0).toString())

  // Calculate stock status for progress bar - fixed calculation
  const restockLevel = item.normal_restock_level || Math.max(item.current_amount * 2, 100)
  const stockPercentage = Math.min((item.current_amount / restockLevel) * 100, 100)
  
  // Use consistent logic for both dot and progress bar colors
  const isLowStock = item.low_stock_threshold 
    ? item.current_amount <= item.low_stock_threshold
    : stockPercentage <= 30

  const handleSaveAmount = () => {
    const newAmount = parseFloat(editAmount)
    if (!isNaN(newAmount) && newAmount >= 0) {
      onUpdateDirectAmount(item.id, newAmount)
    }
    setIsEditingAmount(false)
  }

  const handleSaveUnit = () => {
    if (editUnit !== item.unit) {
      onUpdateUnit(item.id, editUnit)
    }
    setIsEditingUnit(false)
  }

  const handleSaveRestock = () => {
    const newLevel = parseFloat(editRestock)
    if (!isNaN(newLevel) && newLevel > 0) {
      onUpdateRestockLevel(item.id, newLevel)
    }
    setIsEditingRestock(false)
  }

  return (
    <div className="border rounded-lg transition-all duration-200 hover:shadow-sm bg-white">
      {/* Compact Header */}
      <div 
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Stock indicator */}
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${
              isLowStock ? 'bg-red-500' : 
              stockPercentage > 60 ? 'bg-green-500' : 
              'bg-yellow-500'
            }`} />
            {isLowStock && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            )}
          </div>
          
          {/* Name and amount */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{item.name}</div>
            <div className="text-xs text-muted-foreground">
              {item.current_amount} {item.unit}
              {isLowStock && <span className="text-red-600 ml-1">• Low</span>}
            </div>
          </div>
          
          {/* Auto-restock checkbox */}
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-1">
              <input
                type="checkbox"
                id={`auto-${item.id}`}
                checked={item.auto_add_to_shopping || false}
                onChange={(e) => {
                  e.stopPropagation()
                  onUpdateAutoShopping(item.id, e.target.checked)
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label 
                htmlFor={`auto-${item.id}`} 
                className="text-xs text-gray-600 cursor-pointer select-none"
                onClick={(e) => e.stopPropagation()}
              >
                Auto
              </label>
            </div>
            {item.auto_add_to_shopping && (
              <ShoppingCart className="h-3 w-3 text-blue-500" />
            )}
          </div>
        </div>
        
        {/* Expand indicator */}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
          expanded ? 'rotate-180' : ''
        }`} />
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t bg-gray-50/50 p-3 space-y-3">
          {/* Stock Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Stock Level</span>
              <span className="font-medium">{Math.round(stockPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  stockPercentage > 60 ? 'bg-green-500' : 
                  stockPercentage > 30 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
            {item.normal_restock_level && (
              <div className="text-xs text-muted-foreground">
                Target: {item.normal_restock_level} {item.unit}
              </div>
            )}
          </div>

          {/* Detailed Controls */}
          <div className="grid grid-cols-2 gap-3">
            {/* Amount editing */}
            <div className="space-y-1">
              <Label className="text-xs">Current Amount</Label>
              {isEditingAmount ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="h-8 text-sm"
                    step="0.1"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveAmount()
                      if (e.key === 'Escape') {
                        setEditAmount(item.current_amount.toString())
                        setIsEditingAmount(false)
                      }
                    }}
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={handleSaveAmount} className="h-8 w-8 p-0">
                    <Check className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingAmount(true)}
                  className="h-8 justify-start font-mono"
                >
                  <Edit3 className="h-3 w-3 mr-2" />
                  {item.current_amount}
                </Button>
              )}
            </div>

            {/* Unit editing */}
            <div className="space-y-1">
              <Label className="text-xs">Unit</Label>
              {isEditingUnit ? (
                <div className="flex items-center gap-1">
                  <Select value={editUnit} onValueChange={setEditUnit}>
                    <SelectTrigger className="h-8">
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
                  <Button size="sm" variant="ghost" onClick={handleSaveUnit} className="h-8 w-8 p-0">
                    <Check className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingUnit(true)}
                  className="h-8 justify-start"
                >
                  <Edit3 className="h-3 w-3 mr-2" />
                  {item.unit}
                </Button>
              )}
            </div>

            {/* Restock level editing */}
            <div className="space-y-1">
              <Label className="text-xs">Target Level</Label>
              {isEditingRestock ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={editRestock}
                    onChange={(e) => setEditRestock(e.target.value)}
                    className="h-8 text-sm"
                    step="1"
                    min="1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRestock()
                      if (e.key === 'Escape') {
                        setEditRestock((item.normal_restock_level || 0).toString())
                        setIsEditingRestock(false)
                      }
                    }}
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={handleSaveRestock} className="h-8 w-8 p-0">
                    <Check className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingRestock(true)}
                  className="h-8 justify-start"
                >
                  <Edit3 className="h-3 w-3 mr-2" />
                  {item.normal_restock_level || 'Set'}
                </Button>
              )}
            </div>

            {/* Delete button */}
            <div className="space-y-1">
              <Label className="text-xs">Actions</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="h-8 text-destructive hover:text-destructive justify-start"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Remove
              </Button>
            </div>
          </div>

          {/* Additional info */}
          <div className="text-xs text-muted-foreground pt-2 border-t space-y-1">
            <div className="flex justify-between">
              <span>Added by {item.added_by}</span>
              {item.min_buy_amount && (
                <span>Min buy: {item.min_buy_amount} {item.unit}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.auto_add_to_shopping 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.auto_add_to_shopping ? '🛒 Auto-restock enabled' : 'Manual restock only'}
                </span>
              </div>
              {item.seasonal_availability && (
                <span className="text-xs text-orange-600">
                  🗓️ Seasonal ({item.seasonal_availability.months.length} months)
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}