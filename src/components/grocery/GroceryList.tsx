import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Copy, Trash2, Wifi, WifiOff, RotateCw, Package } from "lucide-react"
import type { GroceryCategory, GroceryItem } from "@/types"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/data"
import { useSharedGroceryList } from "@/hooks/useSharedGroceryList"
import { usePantryInventory } from "@/hooks/usePantryInventory"

interface GroceryListProps {
  categories: GroceryCategory[]
}

export function GroceryList({ categories }: GroceryListProps) {
  const { 
    checkedItems, 
    toggleItem, 
    uncheckAll, 
    getProgress, 
    lastSync, 
    isOnline, 
    syncWithServer 
  } = useSharedGroceryList()
  
  const { isItemAvailable } = usePantryInventory()

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

  const getTotalItems = () => {
    return categories.reduce((total, category) => total + category.items.length, 0)
  }

  const total = getTotalItems()
  const progress = getProgress(total)

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">🛒 Grocery List</h2>
            <div className={`text-xs px-2 py-1 rounded-full ${isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {isOnline ? (
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  Synced
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  Offline
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {Math.round((progress / 100) * total)} of {total} items checked • Total: {formatCurrency(getTotalCost())}
          </p>
          {lastSync && (
            <p className="text-xs text-muted-foreground">
              Last sync: {lastSync.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={syncWithServer} disabled={!isOnline}>
            <RotateCw className="h-4 w-4" />
            Sync
          </Button>
          
          <Button variant="outline" size="sm" onClick={copyGroceryList}>
            <Copy className="h-4 w-4" />
            Copy List
          </Button>
          
          {progress > 0 && (
            <Button variant="secondary" size="sm" onClick={uncheckAll}>
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
            style={{ width: `${progress}%` }}
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
            isItemAvailable={isItemAvailable}
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
  isItemAvailable: (itemId: string) => boolean
}

function GroceryCategoryCard({ category, checkedItems, onToggleItem, isItemAvailable }: GroceryCategoryCardProps) {
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
            isPantryItem={isItemAvailable(item.id)}
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
  isPantryItem: boolean
}

function GroceryItemRow({ item, checked, onToggle, isPantryItem }: GroceryItemRowProps) {
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
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{item.name}</span>
            {isPantryItem && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                <Package className="w-3 h-3 inline mr-1" />
                In Stock
              </span>
            )}
          </div>
          <span className={cn(
            "text-sm font-medium text-muted-foreground",
            isPantryItem && "line-through opacity-50"
          )}>
            {isPantryItem ? "Free" : formatCurrency(item.price)}
          </span>
        </div>
        
        {item.quantity && (
          <p className="text-xs text-muted-foreground">{item.quantity}</p>
        )}
      </div>
    </div>
  )
}