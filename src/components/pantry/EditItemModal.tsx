import { useState, useEffect } from "react"
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
import type { PantryItem, PantryCategory } from "@/types/pantry"
import { PANTRY_UNITS, validateItemForm } from "@/lib/pantry-utils"

interface EditItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateItem: (itemId: string, updates: Partial<PantryItem>) => Promise<PantryItem>
  onDeleteItem: (itemId: string) => Promise<void>
  item: PantryItem | null
  categories: PantryCategory[]
  loading?: boolean
}

export function EditItemModal({ 
  open, 
  onOpenChange, 
  onUpdateItem,
  onDeleteItem,
  item,
  categories,
  loading = false 
}: EditItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    current_amount: '',
    unit: 'items',
    total_capacity: '',
    expires: '',
    price_per_unit: 0,
    category_id: '',
    notes: ''
  })
  
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Update form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        current_amount: item.current_amount,
        unit: item.unit,
        total_capacity: item.total_capacity,
        expires: item.expires,
        price_per_unit: item.price_per_unit,
        category_id: item.category_id,
        notes: item.notes || ''
      })
      setErrors([])
      setShowDeleteConfirm(false)
    }
  }, [item])

  const handleInputChange = (field: string, value: string | number) => {
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
    if (!item) return
    
    const validationErrors = validateItemForm({
      ...formData,
      category_id: formData.category_id
    })
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      await onUpdateItem(item.id, formData)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update item:', error)
      setErrors(['Failed to update item. Please try again.'])
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!item) return
    
    setSubmitting(true)
    try {
      await onDeleteItem(item.id)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to delete item:', error)
      setErrors(['Failed to delete item. Please try again.'])
      setShowDeleteConfirm(false)
    } finally {
      setSubmitting(false)
    }
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update the details for {item.name}
          </DialogDescription>
        </DialogHeader>

        {!showDeleteConfirm ? (
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
                <Label htmlFor="edit-item-name">Item Name *</Label>
                <Input
                  id="edit-item-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-current-amount">Current Amount *</Label>
                <Input
                  id="edit-current-amount"
                  type="text"
                  value={formData.current_amount}
                  onChange={(e) => handleInputChange('current_amount', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-unit">Unit *</Label>
                <Select
                  id="edit-unit"
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
                <Label htmlFor="edit-total-capacity">Total Capacity *</Label>
                <Input
                  id="edit-total-capacity"
                  type="text"
                  value={formData.total_capacity}
                  onChange={(e) => handleInputChange('total_capacity', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-expires">Expires *</Label>
                <Input
                  id="edit-expires"
                  type="date"
                  value={formData.expires}
                  onChange={(e) => handleInputChange('expires', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-price">Price per Unit</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_per_unit}
                  onChange={(e) => handleInputChange('price_per_unit', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select
                  id="edit-category"
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
                <Label htmlFor="edit-notes">Notes</Label>
                <Input
                  id="edit-notes"
                  type="text"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Optional notes..."
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={submitting}
                className="mr-auto"
              >
                Delete
              </Button>
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
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="font-medium text-red-800 mb-2">Delete {item.name}?</h3>
              <p className="text-sm text-red-700">
                This action cannot be undone. The item will be permanently removed from your pantry.
              </p>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting ? 'Deleting...' : 'Delete Item'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}