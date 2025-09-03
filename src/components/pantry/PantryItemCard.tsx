import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Plus, Minus, Calendar, DollarSign } from "lucide-react"
import type { PantryItem } from "@/types/pantry"
import { 
  calculateStockPercentage, 
  isLowStock, 
  isExpired, 
  expiresSoon, 
  formatDate,
  getStockStatus
} from "@/lib/pantry-utils"

interface PantryItemCardProps {
  item: PantryItem
  onEdit: (item: PantryItem) => void
  onDelete: (itemId: string) => void
  onUpdateAmount: (itemId: string, newAmount: string) => void
  showManagementActions?: boolean
}

export function PantryItemCard({ 
  item, 
  onEdit, 
  onDelete, 
  onUpdateAmount,
  showManagementActions = false 
}: PantryItemCardProps) {
  const [isEditingAmount, setIsEditingAmount] = useState(false)
  const [tempAmount, setTempAmount] = useState(item.current_amount)
  
  const stockPercentage = calculateStockPercentage(item.current_amount, item.total_capacity, item.unit)
  const stockStatus = getStockStatus(item)
  const expired = isExpired(item)
  const lowStock = isLowStock(item)
  const expiringSoon = expiresSoon(item)

  const handleAmountSubmit = () => {
    if (tempAmount !== item.current_amount) {
      onUpdateAmount(item.id, tempAmount)
    }
    setIsEditingAmount(false)
  }

  const handleAmountCancel = () => {
    setTempAmount(item.current_amount)
    setIsEditingAmount(false)
  }

  const handleQuickAdjust = (adjustment: number) => {
    if (item.unit === '%') {
      const currentPercent = parseInt(item.current_amount.replace('%', '')) || 0
      const newPercent = Math.max(0, Math.min(100, currentPercent + adjustment))
      onUpdateAmount(item.id, `${newPercent}%`)
    } else {
      const currentAmount = parseFloat(item.current_amount.replace(/[^0-9.]/g, '')) || 0
      const newAmount = Math.max(0, currentAmount + adjustment)
      onUpdateAmount(item.id, `${newAmount}`)
    }
  }

  return (
    <div className={`
      border rounded-lg p-4 space-y-3 transition-all hover:shadow-md
      ${expired ? 'border-red-300 bg-red-50' : ''}
      ${lowStock && !expired ? 'border-yellow-300 bg-yellow-50' : ''}
      ${expiringSoon && !expired && !lowStock ? 'border-orange-300 bg-orange-50' : ''}
    `}>
      {/* Header with item name and status */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{item.name}</h4>
          {item.notes && (
            <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
          )}
          
          {/* Status badges */}
          <div className="flex flex-wrap gap-1 mt-2">
            {expired && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                ❌ Expired
              </span>
            )}
            {lowStock && !expired && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                ⚠️ Low Stock
              </span>
            )}
            {expiringSoon && !expired && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                📅 Expires Soon
              </span>
            )}
            {item.custom_item && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                ✨ Custom
              </span>
            )}
          </div>
        </div>

        {showManagementActions && (
          <div className="flex items-center gap-1 ml-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(item)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(item.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Stock level with progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Stock Level</span>
          <span className="font-medium">{stockPercentage}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${stockStatus.color}`}
            style={{ width: `${stockPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{item.current_amount} {item.unit}</span>
          <span>{item.total_capacity} {item.unit}</span>
        </div>
      </div>

      {/* Amount adjustment controls */}
      {showManagementActions && (
        <div className="space-y-2">
          {isEditingAmount ? (
            <div className="flex items-center gap-2">
              <Input
                value={tempAmount}
                onChange={(e) => setTempAmount(e.target.value)}
                className="flex-1 h-8 text-sm"
                placeholder={`Amount in ${item.unit}`}
              />
              <Button size="sm" onClick={handleAmountSubmit} className="h-8 px-3">
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleAmountCancel} className="h-8 px-3">
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickAdjust(-1)}
                className="h-8 w-8 p-0"
                disabled={stockPercentage === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditingAmount(true)}
                className="flex-1 h-8 text-sm font-medium"
              >
                {item.current_amount} {item.unit}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuickAdjust(1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Footer info */}
      <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(item.expires)}</span>
          </div>
          
          {item.price_per_unit > 0 && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>${item.price_per_unit.toFixed(2)}</span>
            </div>
          )}
        </div>
        
        <div className="text-right">
          <div>Added by {item.created_by}</div>
          {item.updated_at !== item.created_at && (
            <div>Updated {formatDate(item.updated_at)}</div>
          )}
        </div>
      </div>
    </div>
  )
}