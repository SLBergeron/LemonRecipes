import type { PantryItem, PantryCategory, PantryChangeLog, AddItemFormData, AddCategoryFormData } from '@/types/pantry'

// Generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Get or create user identity for change tracking
export function getUserIdentity(): { id: string; name: string } {
  let user = localStorage.getItem('lemon-recipes-user')
  
  if (!user) {
    // Create anonymous user identity
    const names = ['Simon', 'Léa', 'Guest']
    const randomName = names[Math.floor(Math.random() * names.length)]
    
    const identity = {
      id: generateId(),
      name: randomName
    }
    
    localStorage.setItem('lemon-recipes-user', JSON.stringify(identity))
    return identity
  }
  
  return JSON.parse(user)
}

// Create a new pantry item from form data
export function createPantryItem(formData: AddItemFormData, categoryId: string): PantryItem {
  const user = getUserIdentity()
  const now = new Date().toISOString()
  
  return {
    id: generateId(),
    name: formData.name.trim(),
    current_amount: formData.current_amount,
    unit: formData.unit,
    total_capacity: formData.total_capacity,
    expires: formData.expires,
    price_per_unit: formData.price_per_unit,
    category_id: categoryId,
    created_by: user.name,
    created_at: now,
    updated_at: now,
    custom_item: true,
    notes: formData.notes?.trim() || undefined,
    barcode: formData.barcode?.trim() || undefined
  }
}

// Create a new pantry category from form data
export function createPantryCategory(formData: AddCategoryFormData): PantryCategory {
  const now = new Date().toISOString()
  
  return {
    id: generateId(),
    title: formData.title.trim(),
    emoji: formData.emoji,
    color: '#FBD38D', // Default lemon yellow color
    items: [],
    custom_category: true,
    created_at: now,
    updated_at: now,
    description: formData.description?.trim() || undefined
  }
}

// Create a change log entry
export function createChangeLog(
  action: PantryChangeLog['action'],
  targetType: 'item' | 'category',
  targetId: string,
  oldData?: any,
  newData?: any
): PantryChangeLog {
  const user = getUserIdentity()
  
  return {
    id: generateId(),
    action,
    target_type: targetType,
    target_id: targetId,
    old_data: oldData,
    new_data: newData,
    timestamp: new Date().toISOString(),
    user_id: user.id,
    user_name: user.name,
    synced: false
  }
}

// Calculate stock level percentage
export function calculateStockPercentage(currentAmount: string, totalCapacity: string, unit: string): number {
  if (unit === '%') {
    return parseInt(currentAmount.replace('%', '')) || 0
  }
  
  // Try to parse numeric values
  const current = parseFloat(currentAmount.replace(/[^0-9.]/g, '')) || 0
  const total = parseFloat(totalCapacity.replace(/[^0-9.]/g, '')) || 1
  
  return Math.min(Math.round((current / total) * 100), 100)
}

// Check if item is low stock (less than 30%)
export function isLowStock(item: PantryItem): boolean {
  return calculateStockPercentage(item.current_amount, item.total_capacity, item.unit) < 30
}

// Check if item is expired
export function isExpired(item: PantryItem): boolean {
  const expireDate = new Date(item.expires)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return expireDate < today
}

// Check if item expires soon (within 3 days)
export function expiresSoon(item: PantryItem): boolean {
  const expireDate = new Date(item.expires)
  const threeDaysFromNow = new Date()
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
  return expireDate <= threeDaysFromNow && !isExpired(item)
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  
  // If it's today, show "Today"
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  }
  
  // If it's tomorrow, show "Tomorrow"
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  }
  
  // If it's yesterday, show "Yesterday"
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }
  
  // Otherwise show formatted date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  })
}

// Validate item form data
export function validateItemForm(data: AddItemFormData): string[] {
  const errors: string[] = []
  
  if (!data.name.trim()) {
    errors.push('Item name is required')
  }
  
  if (!data.current_amount.trim()) {
    errors.push('Current amount is required')
  }
  
  if (!data.unit) {
    errors.push('Unit is required')
  }
  
  if (!data.total_capacity.trim()) {
    errors.push('Total capacity is required')
  }
  
  if (!data.expires) {
    errors.push('Expiration date is required')
  }
  
  if (data.price_per_unit < 0) {
    errors.push('Price cannot be negative')
  }
  
  if (!data.category_id) {
    errors.push('Category is required')
  }
  
  return errors
}

// Validate category form data
export function validateCategoryForm(data: AddCategoryFormData): string[] {
  const errors: string[] = []
  
  if (!data.title.trim()) {
    errors.push('Category name is required')
  }
  
  if (!data.emoji.trim()) {
    errors.push('Category emoji is required')
  }
  
  if (!data.color) {
    errors.push('Category color is required')
  }
  
  return errors
}

// Sort items within a category
export function sortPantryItems(items: PantryItem[]): PantryItem[] {
  return items.sort((a, b) => {
    // Expired items first
    const aExpired = isExpired(a)
    const bExpired = isExpired(b)
    if (aExpired && !bExpired) return -1
    if (!aExpired && bExpired) return 1
    
    // Low stock items next
    const aLowStock = isLowStock(a)
    const bLowStock = isLowStock(b)
    if (aLowStock && !bLowStock) return -1
    if (!aLowStock && bLowStock) return 1
    
    // Then alphabetical
    return a.name.localeCompare(b.name)
  })
}

// Get stock status for UI display
export function getStockStatus(item: PantryItem): {
  level: 'high' | 'medium' | 'low' | 'empty'
  color: string
  label: string
} {
  const percentage = calculateStockPercentage(item.current_amount, item.total_capacity, item.unit)
  
  if (percentage === 0) {
    return { level: 'empty', color: 'bg-red-500', label: 'Empty' }
  } else if (percentage < 30) {
    return { level: 'low', color: 'bg-yellow-500', label: 'Low Stock' }
  } else if (percentage < 70) {
    return { level: 'medium', color: 'bg-blue-500', label: 'Medium' }
  } else {
    return { level: 'high', color: 'bg-green-500', label: 'Well Stocked' }
  }
}