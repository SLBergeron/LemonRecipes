import type { PantryInventory, PantryCategory, PantryItem } from '@/types/pantry'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Minus, AlertTriangle } from 'lucide-react'

interface PantryInventoryProps {
  pantry: PantryInventory
  onUpdateAmount?: (itemId: string, newAmount: string) => void
}

interface PantryItemCardProps {
  item: PantryItem
  onUpdateAmount?: (itemId: string, newAmount: string) => void
}

function PantryItemCard({ item, onUpdateAmount }: PantryItemCardProps) {
  const getStockLevel = (item: PantryItem): { level: 'low' | 'medium' | 'high'; percentage: number } => {
    if (item.unit === '%') {
      const percentage = parseInt(item.current_amount.replace('%', ''))
      return {
        level: percentage < 30 ? 'low' : percentage < 70 ? 'medium' : 'high',
        percentage
      }
    }
    
    // For unit-based items, estimate percentage based on current vs total capacity
    const current = parseInt(item.current_amount.replace(/[^0-9]/g, ''))
    const total = parseInt(item.total_capacity.replace(/[^0-9]/g, ''))
    const percentage = Math.round((current / total) * 100)
    
    return {
      level: percentage < 30 ? 'low' : percentage < 70 ? 'medium' : 'high',
      percentage
    }
  }

  const getExpirationStatus = (expires: string): { status: 'expired' | 'expiring' | 'fresh'; daysLeft: number } => {
    const expiryDate = new Date(expires)
    const today = new Date()
    const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    return {
      status: daysLeft < 0 ? 'expired' : daysLeft < 14 ? 'expiring' : 'fresh',
      daysLeft
    }
  }

  const { level, percentage } = getStockLevel(item)
  const { status: expirationStatus, daysLeft } = getExpirationStatus(item.expires)

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">{item.name}</h4>
              <p className="text-xs text-muted-foreground">
                {item.current_amount} of {item.total_capacity}
              </p>
            </div>
            
            <div className="flex flex-col items-end space-y-1">
              <span className={`text-xs px-2 py-1 rounded ${
                level === 'low' ? 'bg-red-100 text-red-800' :
                level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {percentage}%
              </span>
              
              {expirationStatus !== 'fresh' && (
                <span className={`text-xs px-2 py-1 rounded flex items-center ${
                  expirationStatus === 'expired' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {expirationStatus === 'expired' ? 'Expired' : `${daysLeft}d left`}
                </span>
              )}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                level === 'low' ? 'bg-red-500' :
                level === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Expires: {new Date(item.expires).toLocaleDateString()}
            </p>
            <p className="text-xs font-medium">
              ${item.price_per_unit}
            </p>
          </div>
          
          {onUpdateAmount && (
            <div className="flex items-center space-x-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Implement decrease logic
                  console.log('Decrease', item.id)
                }}
              >
                <Minus className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Implement increase logic
                  console.log('Increase', item.id)
                }}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface PantryCategoryProps {
  category: PantryCategory
  onUpdateAmount?: (itemId: string, newAmount: string) => void
}

function PantryCategoryCard({ category, onUpdateAmount }: PantryCategoryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <span className="text-lg">{category.emoji}</span>
          <span>{category.title}</span>
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
            {category.items.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {category.items.map((item) => (
          <PantryItemCard
            key={item.id}
            item={item}
            onUpdateAmount={onUpdateAmount}
          />
        ))}
      </CardContent>
    </Card>
  )
}

export function PantryInventory({ pantry, onUpdateAmount }: PantryInventoryProps) {
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

  return (
    <div className="space-y-4">
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
            onUpdateAmount={onUpdateAmount}
          />
        ))}
      </div>
    </div>
  )
}