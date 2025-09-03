import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Copy, Trash2 } from "lucide-react"
import type { GroceryCategory, GroceryItem } from "@/types"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/data"

interface GroceryListProps {
  categories: GroceryCategory[]
}

export function GroceryList({ categories }: GroceryListProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  // Load checked items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("grocery-checked-items")
    if (saved) {
      setCheckedItems(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage whenever checked items change
  useEffect(() => {
    localStorage.setItem("grocery-checked-items", JSON.stringify(checkedItems))
  }, [checkedItems])

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const clearAllChecks = () => {
    setCheckedItems({})
  }

  const copyGroceryList = () => {
    const listText = categories
      .map(category => {
        const items = category.items
          .map(item => `□ ${item.name}${item.quantity ? ` — ${item.quantity}` : ''} — ${formatCurrency(item.price)}`)
          .join('\n')
        return `${category.title}\n${items}`
      })
      .join('\n\n')
    
    navigator.clipboard.writeText(listText).then(() => {
      // Could add toast notification here
      console.log('Grocery list copied to clipboard!')
    })
  }

  const getTotalCost = () => {
    return categories.reduce((total, category) => 
      total + category.items.reduce((catTotal, item) => catTotal + item.price, 0), 0
    )
  }

  const getCheckedCount = () => {
    const totalItems = categories.reduce((total, category) => total + category.items.length, 0)
    const checkedCount = Object.values(checkedItems).filter(Boolean).length
    return { checked: checkedCount, total: totalItems }
  }

  const { checked, total } = getCheckedCount()

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">🛒 Grocery List</h2>
          <p className="text-sm text-muted-foreground">
            {checked} of {total} items checked • Total: {formatCurrency(getTotalCost())}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyGroceryList}>
            <Copy className="h-4 w-4" />
            Copy List
          </Button>
          
          {checked > 0 && (
            <Button variant="secondary" size="sm" onClick={clearAllChecks}>
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-lemon h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(checked / total) * 100}%` }}
          />
        </div>
      )}

      {/* Grocery categories */}
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map(category => (
          <GroceryCategoryCard
            key={category.id}
            category={category}
            checkedItems={checkedItems}
            onToggleItem={toggleItem}
          />
        ))}
      </div>
    </div>
  )
}

interface GroceryCategoryCardProps {
  category: GroceryCategory
  checkedItems: Record<string, boolean>
  onToggleItem: (itemId: string) => void
}

function GroceryCategoryCard({ category, checkedItems, onToggleItem }: GroceryCategoryCardProps) {
  const getBorderColor = (color: string) => {
    switch (color) {
      case "#dc3545": return "border-l-red-500"
      case "#007bff": return "border-l-blue-500"
      case "#28a745": return "border-l-green-500"
      case "#f7c52d": return "border-l-yellow-500"
      default: return "border-l-gray-300"
    }
  }

  return (
    <Card className={cn("border-l-4", getBorderColor(category.color))}>
      <CardHeader>
        <CardTitle className="text-base" style={{ color: category.color }}>
          {category.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {category.items.map(item => (
          <GroceryItemRow
            key={item.id}
            item={item}
            checked={checkedItems[item.id] || false}
            onToggle={() => onToggleItem(item.id)}
          />
        ))}
      </CardContent>
    </Card>
  )
}

interface GroceryItemRowProps {
  item: GroceryItem
  checked: boolean
  onToggle: () => void
}

function GroceryItemRow({ item, checked, onToggle }: GroceryItemRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all select-none",
        "hover:bg-accent hover:border-lemon",
        "active:scale-98 min-h-[48px]", // Touch-friendly height
        checked && "bg-secondary border-green-500 opacity-70"
      )}
      onClick={onToggle}
    >
      <div className="flex-shrink-0">
        {checked ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      
      <div className={cn("flex-1 min-w-0", checked && "line-through")}>
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{item.name}</span>
          <span className="text-sm font-medium text-muted-foreground">
            {formatCurrency(item.price)}
          </span>
        </div>
        
        {item.quantity && (
          <p className="text-xs text-muted-foreground">{item.quantity}</p>
        )}
      </div>
    </div>
  )
}