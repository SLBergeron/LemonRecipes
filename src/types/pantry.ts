export interface PantryItem {
  id: string
  name: string
  current_amount: string
  unit: string
  total_capacity: string
  expires: string
  price_per_unit: number
  category_id: string
  created_by: string
  created_at: string
  updated_at: string
  custom_item: boolean // true for user-added items
  notes?: string
  barcode?: string
}

export interface PantryCategory {
  id: string
  title: string
  emoji: string
  color: string
  items: PantryItem[]
  custom_category: boolean // true for user-added categories
  created_at: string
  updated_at: string
  description?: string
}

export interface PantryInventory {
  last_updated: string
  categories: PantryCategory[]
  version: number // For conflict resolution
  sync_metadata: {
    last_sync: string
    pending_changes: number
    sync_status: 'synced' | 'syncing' | 'error' | 'offline'
  }
}

export interface PantryChangeLog {
  id: string
  action: 'add' | 'update' | 'remove' | 'add_category' | 'remove_category'
  target_type: 'item' | 'category'
  target_id: string
  old_data?: Partial<PantryItem | PantryCategory>
  new_data: Partial<PantryItem | PantryCategory>
  timestamp: string
  user_id: string
  user_name: string
  synced: boolean
  conflict_resolved?: boolean
}

export interface PantryUsage {
  item_id: string
  amount_used: string
  recipe_id: string
  meal_id: string
  date: string
}

export interface PantryNotification {
  id: string
  type: 'low_stock' | 'expired' | 'added_by_other' | 'updated_by_other' | 'sync_conflict' | 'sync_success'
  item?: PantryItem
  category?: PantryCategory
  message: string
  timestamp: string
  read: boolean
  action_required: boolean
  action_data?: any
}

export interface AddItemFormData {
  name: string
  current_amount: string
  unit: string
  total_capacity: string
  expires: string
  price_per_unit: number
  category_id: string
  notes?: string
  barcode?: string
}

export interface AddCategoryFormData {
  title: string
  emoji: string
  description?: string
}

// Common units for pantry items
export const PANTRY_UNITS = [
  { value: '%', label: 'Percentage (%)' },
  { value: 'cups', label: 'Cups' },
  { value: 'tbsp', label: 'Tablespoons' },
  { value: 'tsp', label: 'Teaspoons' },
  { value: 'lbs', label: 'Pounds' },
  { value: 'oz', label: 'Ounces' },
  { value: 'g', label: 'Grams' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'ml', label: 'Milliliters' },
  { value: 'l', label: 'Liters' },
  { value: 'items', label: 'Individual Items' },
  { value: 'cans', label: 'Cans' },
  { value: 'bottles', label: 'Bottles' },
  { value: 'packages', label: 'Packages' }
] as const

export type PantryUnit = typeof PANTRY_UNITS[number]['value']

// Category colors for UI
export const CATEGORY_COLORS = [
  { value: '#FBD38D', label: 'Lemon Yellow', class: 'bg-yellow-200' },
  { value: '#34D399', label: 'Green', class: 'bg-green-300' },
  { value: '#60A5FA', label: 'Blue', class: 'bg-blue-300' },
  { value: '#F87171', label: 'Red', class: 'bg-red-300' },
  { value: '#A78BFA', label: 'Purple', class: 'bg-purple-300' },
  { value: '#FB923C', label: 'Orange', class: 'bg-orange-300' },
  { value: '#F472B6', label: 'Pink', class: 'bg-pink-300' },
  { value: '#6B7280', label: 'Gray', class: 'bg-gray-300' }
] as const