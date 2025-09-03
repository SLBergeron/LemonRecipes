export interface PantryItem {
  id: string
  name: string
  current_amount: string
  unit: string
  total_capacity: string
  expires: string
  price_per_unit: number
}

export interface PantryCategory {
  id: string
  title: string
  emoji: string
  color: string
  items: PantryItem[]
}

export interface PantryInventory {
  last_updated: string
  categories: PantryCategory[]
}

export interface PantryUsage {
  item_id: string
  amount_used: string
  recipe_id: string
  meal_id: string
  date: string
}