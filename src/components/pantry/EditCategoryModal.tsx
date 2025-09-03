import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { PantryCategory } from "@/types/pantry"

interface EditCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateCategory: (categoryId: string, updates: Partial<PantryCategory>) => Promise<void>
  onDeleteCategory: (categoryId: string) => Promise<void>
  category: PantryCategory | null
  loading?: boolean
}

const COMMON_EMOJIS = ['🥬', '🍖', '🥛', '🧀', '🍞', '🥫', '🧂', '🍯', '🧊', '🍿', '🫖', '🧴']

export function EditCategoryModal({ 
  open, 
  onOpenChange, 
  onUpdateCategory,
  onDeleteCategory,
  category,
  loading = false 
}: EditCategoryModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    emoji: '',
    description: ''
  })
  
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Update form data when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        title: category.title,
        emoji: category.emoji,
        description: category.description || ''
      })
      setErrors([])
      setShowDeleteConfirm(false)
    }
  }, [category])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const validateForm = (): string[] => {
    const validationErrors: string[] = []
    
    if (!formData.title.trim()) {
      validationErrors.push('Category title is required')
    }
    
    if (formData.title.trim().length < 2) {
      validationErrors.push('Category title must be at least 2 characters')
    }
    
    if (!formData.emoji.trim()) {
      validationErrors.push('Category emoji is required')
    }

    return validationErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) return
    
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      await onUpdateCategory(category.id, {
        title: formData.title.trim(),
        emoji: formData.emoji.trim(),
        description: formData.description?.trim() || ''
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update category:', error)
      setErrors(['Failed to update category. Please try again.'])
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!category) return
    
    setSubmitting(true)
    try {
      await onDeleteCategory(category.id)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to delete category:', error)
      setErrors(['Failed to delete category. Please try again.'])
      setShowDeleteConfirm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const canDelete = category && category.items.length === 0

  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the details for {category.title}
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

            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category-title">Category Name *</Label>
                <Input
                  id="edit-category-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-category-emoji">Emoji *</Label>
                <div className="mt-1 space-y-2">
                  <Input
                    id="edit-category-emoji"
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => handleInputChange('emoji', e.target.value)}
                    className="w-20"
                    maxLength={2}
                  />
                  <div className="flex flex-wrap gap-2">
                    {COMMON_EMOJIS.map((emoji) => (
                      <Button
                        key={emoji}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('emoji', emoji)}
                        className={`w-10 h-10 p-0 ${formData.emoji === emoji ? 'ring-2 ring-lemon' : ''}`}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-category-description">Description</Label>
                <Input
                  id="edit-category-description"
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Optional description..."
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              {canDelete && (
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={submitting}
                  className="mr-auto"
                >
                  Delete
                </Button>
              )}
              {!canDelete && category.items.length > 0 && (
                <p className="text-xs text-muted-foreground mr-auto">
                  Cannot delete category with {category.items.length} items
                </p>
              )}
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
              <h3 className="font-medium text-red-800 mb-2">Delete {category.title}?</h3>
              <p className="text-sm text-red-700">
                This action cannot be undone. The category will be permanently removed from your pantry.
              </p>
              {!canDelete && (
                <p className="text-sm text-red-700 mt-2 font-medium">
                  You must move or delete all items in this category first.
                </p>
              )}
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
                disabled={submitting || !canDelete}
              >
                {submitting ? 'Deleting...' : 'Delete Category'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}