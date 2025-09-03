import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Trash2, Package, AlertTriangle, Check, X } from "lucide-react"
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

  const handleUpdateAmount = async (itemId: string, currentAmount: number, delta: number) => {
    const newAmount = Math.max(0, currentAmount + delta)
    try {
      await updateItemAmount(itemId, newAmount)
    } catch (err) {
      console.error('Failed to update amount:', err)
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
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-sm text-muted-foreground">Active Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">{stats.lowStockCount}</div>
            <p className="text-sm text-muted-foreground">Low Stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map(item => (
                <Badge key={item.id} variant="outline" className="border-orange-300 text-orange-800">
                  {item.name}: {item.current_amount} {item.unit}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Add New Item</CardTitle>
            <CardDescription>Add an item to your pantry inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Name</Label>
                <Input
                  id="item-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Olive Oil"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-category">Category</Label>
                <Select 
                  value={newItem.categoryId} 
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, categoryId: value }))}
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
                  min="0"
                  step="0.1"
                  value={newItem.amount}
                  onChange={(e) => setNewItem(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
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
              <Button onClick={handleAddItem} disabled={!newItem.name.trim()}>
                Add Item
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items List */}
      <div className="space-y-4">
        {pantry.categories.map(category => {
          const categoryItems = selectedCategory === 'all' 
            ? category.items
            : (selectedCategory === category.id ? category.items : [])

          if (categoryItems.length === 0) return null

          return (
            <Card key={category.id}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{category.emoji}</span>
                  {category.name}
                  <Badge variant="secondary">{categoryItems.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {categoryItems.map(item => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onUpdateAmount={handleUpdateAmount}
                      onUpdateDirectAmount={handleDirectUpdateAmount}
                      onUpdateUnit={handleUpdateUnit}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
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
  onUpdateAmount: (itemId: string, currentAmount: number, delta: number) => void
  onUpdateDirectAmount: (itemId: string, newAmount: number) => void
  onUpdateUnit: (itemId: string, newUnit: string) => void
  onDelete: (itemId: string) => void
}

function ItemRow({ item, onUpdateAmount, onUpdateDirectAmount, onUpdateUnit, onDelete }: ItemRowProps) {
  const [isEditingAmount, setIsEditingAmount] = useState(false)
  const [isEditingUnit, setIsEditingUnit] = useState(false)
  const [editAmount, setEditAmount] = useState(item.current_amount.toString())
  const [editUnit, setEditUnit] = useState(item.unit)

  const isLowStock = item.low_stock_threshold 
    ? item.current_amount <= item.low_stock_threshold
    : item.unit === 'items' || item.unit === 'cans' || item.unit === 'bottles'
      ? item.current_amount < 2
      : item.current_amount < 1

  // Calculate stock status for progress bar
  const restockLevel = item.normal_restock_level || (item.current_amount * 2)
  const stockPercentage = Math.min((item.current_amount / restockLevel) * 100, 100)

  const handleSaveAmount = () => {
    const newAmount = parseFloat(editAmount)
    if (!isNaN(newAmount) && newAmount >= 0) {
      onUpdateDirectAmount(item.id, newAmount)
    }
    setIsEditingAmount(false)
  }

  const handleCancelAmount = () => {
    setEditAmount(item.current_amount.toString())
    setIsEditingAmount(false)
  }

  const handleSaveUnit = () => {
    if (editUnit !== item.unit) {
      onUpdateUnit(item.id, editUnit)
    }
    setIsEditingUnit(false)
  }

  const handleCancelUnit = () => {
    setEditUnit(item.unit)
    setIsEditingUnit(false)
  }

  return (
    <div className="p-3 sm:p-4 border rounded-lg space-y-3 sm:space-y-2">
      {/* Header Row - Name and Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-base truncate">{item.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            {isLowStock && (
              <Badge variant="destructive" className="text-xs px-1 py-0">
                Low Stock
              </Badge>
            )}
            {item.normal_restock_level && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                Target: {item.normal_restock_level} {item.unit}
              </Badge>
            )}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(item.id)}
          className="text-destructive hover:text-destructive flex-shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Stock Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Current Stock</span>
          <span>{Math.round(stockPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              stockPercentage > 60 ? 'bg-green-500' : 
              stockPercentage > 30 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${stockPercentage}%` }}
          />
        </div>
      </div>

      {/* Amount and Unit Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Decrease Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateAmount(item.id, item.current_amount, -1)}
          disabled={item.current_amount <= 0 || isEditingAmount}
          className="flex-shrink-0"
        >
          <Minus className="h-3 w-3" />
        </Button>

        {/* Amount Display/Edit */}
        <div className="flex-1 flex items-center justify-center gap-2">
          {isEditingAmount ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-20 h-8 text-sm text-center"
                step="0.1"
                min="0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveAmount()
                  if (e.key === 'Escape') handleCancelAmount()
                }}
                autoFocus
                onBlur={handleSaveAmount}
              />
              <Button size="sm" variant="ghost" onClick={handleSaveAmount} className="h-6 w-6 p-0">
                <Check className="h-3 w-3 text-green-600" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingAmount(true)}
              className="font-mono text-lg hover:bg-gray-100 px-3 py-2 rounded transition-colors"
              title="Click to edit amount"
            >
              {item.current_amount}
            </button>
          )}
          
          {/* Unit Display/Edit */}
          {isEditingUnit ? (
            <div className="flex items-center gap-1">
              <Select value={editUnit} onValueChange={setEditUnit}>
                <SelectTrigger className="w-20 h-8 text-sm">
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
              <Button size="sm" variant="ghost" onClick={handleSaveUnit} className="h-6 w-6 p-0">
                <Check className="h-3 w-3 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelUnit} className="h-6 w-6 p-0">
                <X className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingUnit(true)}
              className="text-sm text-muted-foreground hover:bg-gray-100 px-2 py-1 rounded transition-colors"
              title="Click to change unit"
            >
              {item.unit}
            </button>
          )}
        </div>

        {/* Increase Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateAmount(item.id, item.current_amount, 1)}
          disabled={isEditingAmount}
          className="flex-shrink-0"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Additional Info */}
      <div className="text-xs text-muted-foreground flex justify-between items-center">
        <span>Added by {item.added_by}</span>
        {item.min_buy_amount && (
          <span>Min buy: {item.min_buy_amount} {item.unit}</span>
        )}
      </div>
    </div>
  )
}