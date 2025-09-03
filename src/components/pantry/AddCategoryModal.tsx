import { useState } from "react"
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
import type { AddCategoryFormData } from "@/types/pantry"

interface AddCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddCategory: (formData: AddCategoryFormData) => Promise<void>
  loading?: boolean
}

const COMMON_EMOJIS = ['🥬', '🍖', '🥛', '🧀', '🍞', '🥫', '🧂', '🍯', '🧊', '🍿', '🫖', '🧴']

export function AddCategoryModal({ 
  open, 
  onOpenChange, 
  onAddCategory, 
  loading = false 
}: AddCategoryModalProps) {
  const [formData, setFormData] = useState<AddCategoryFormData>({
    title: '',
    emoji: '🥬',
    description: ''
  })
  
  const [errors, setErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  // Reset form when modal opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setFormData({
        title: '',
        emoji: '🥬',
        description: ''
      })
      setErrors([])
    }
    onOpenChange(newOpen)
  }

  const handleInputChange = (field: keyof AddCategoryFormData, value: string) => {
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
    
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      await onAddCategory({
        ...formData,
        title: formData.title.trim(),
        description: formData.description?.trim() || ''
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to add category:', error)
      setErrors(['Failed to add category. Please try again.'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new category to organize your pantry items
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

          <div className="space-y-4">
            <div>
              <Label htmlFor="category-title">Category Name *</Label>
              <Input
                id="category-title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Vegetables, Proteins, Dairy..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category-emoji">Emoji *</Label>
              <div className="mt-1 space-y-2">
                <Input
                  id="category-emoji"
                  type="text"
                  value={formData.emoji}
                  onChange={(e) => handleInputChange('emoji', e.target.value)}
                  placeholder="🥬"
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
              <Label htmlFor="category-description">Description</Label>
              <Input
                id="category-description"
                type="text"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Optional description..."
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
              {submitting ? 'Adding...' : 'Add Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}