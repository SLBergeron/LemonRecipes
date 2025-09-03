import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectOption } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AddItemFormData, PantryCategory } from "@/types/pantry"
import { PANTRY_UNITS, validateItemForm } from "@/lib/pantry-utils"

interface AddItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem: (formData: AddItemFormData) => Promise<void>
  categories: PantryCategory[]
  loading?: boolean
}

export function AddItemModal({ 
  open, 
  onOpenChange, 
  onAddItem, 
  categories,
  loading = false 
}: AddItemModalProps) {
  const [formData, setFormData] = useState<AddItemFormData>({
    name: '',
    current_amount: '',
    unit: 'items',
    total_capacity: '',
    expires: '',
    price_per_unit: 0,
    category_id: categories[0]?.id || '',
    notes: '',
    barcode: ''
  })
  
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  // Set default expiration date to 1 month from now
  const getDefaultExpiration = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    return date.toISOString().split('T')[0]
  }

  // Reset form when modal opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setFormData({
        name: '',
        current_amount: '',
        unit: 'items',
        total_capacity: '',
        expires: getDefaultExpiration(),
        price_per_unit: 0,
        category_id: categories[0]?.id || '',
        notes: '',
        barcode: ''
      })
      setErrors([])
    }
    onOpenChange(newOpen)
  }

  const handleInputChange = (field: keyof AddItemFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateItemForm(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      await onAddItem(formData)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to add item:', error)
      setErrors(['Failed to add item. Please try again.'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Add a new item to your pantry inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <ul className="text-sm text-red-800 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="item-name">Item Name *</Label>
              <Input
                id="item-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Olive Oil, Tomatoes..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="current-amount">Current Amount *</Label>
              <Input
                id="current-amount"
                type="text"
                value={formData.current_amount}
                onChange={(e) => handleInputChange('current_amount', e.target.value)}
                placeholder="e.g., 2, 50%"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="unit">Unit *</Label>
              <Select
                id="unit"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className="mt-1"
              >
                {PANTRY_UNITS.map((unit) => (
                  <SelectOption key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectOption>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="total-capacity">Total Capacity *</Label>
              <Input
                id="total-capacity"
                type="text"
                value={formData.total_capacity}
                onChange={(e) => handleInputChange('total_capacity', e.target.value)}
                placeholder="e.g., 4, 100%"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="expires">Expires *</Label>
              <Input
                id="expires"
                type="date"
                value={formData.expires}
                onChange={(e) => handleInputChange('expires', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="price">Price per Unit</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price_per_unit}
                onChange={(e) => handleInputChange('price_per_unit', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                id="category"
                value={formData.category_id}
                onChange={(e) => handleInputChange('category_id', e.target.value)}
                className="mt-1"
              >
                {categories.map((category) => (
                  <SelectOption key={category.id} value={category.id}>
                    {category.emoji} {category.title}
                  </SelectOption>
                ))}
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                type="text"
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Optional notes..."
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="lemon"
              disabled={submitting || loading}
            >
              {submitting ? 'Adding...' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}