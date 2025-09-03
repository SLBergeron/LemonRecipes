// Simplified types for LemonRecipes Smart Pantry System

export type UserId = 'simon' | 'lea'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

// Core Pantry Types
export interface SimplePantryItem {
  id: string
  name: string
  current_amount: number
  unit: string
  category: string
  added_by: UserId
  updated_at: string
  min_buy_amount?: number // Minimum amount to buy when shopping
  normal_restock_level?: number // Target amount when restocking
  restock_unit?: string // Unit for restocking (may differ from current unit)
  low_stock_threshold?: number // Custom low stock threshold
  seasonal_availability?: {
    months: number[] // Array of month numbers (1-12) when item is typically available
    note?: string // Optional note about seasonal availability
  }
  auto_add_to_shopping?: boolean // Whether to automatically add to shopping list when low/out
  preferred_store?: string // Where to buy this item
}

export interface PantryCategory {
  id: string
  name: string
  emoji: string
  items: SimplePantryItem[]
}

export interface SimplePantryInventory {
  last_updated: string
  categories: PantryCategory[]
}

// Recipe System
export interface RecipeIngredient {
  name: string
  amount: number
  unit: string
  pantry_item_id?: string // Links to pantry item if available
  recipe_id?: string // Links to another recipe (for sauces/sub-recipes)
  optional?: boolean
}

export interface SimpleRecipe {
  id: string
  title: string
  servings: number
  prep_time: number // minutes
  cook_time: number // minutes
  ingredients: RecipeIngredient[]
  instructions: string[]
  tags: string[]
  created_by: UserId
  created_at: string
  can_make?: boolean // Calculated based on pantry availability
  missing_ingredients?: string[] // Calculated missing items
  ingredient_availability?: Record<string, { available: boolean; pantry_item_id?: string; reason?: string }> // Detailed ingredient availability
}

export interface RecipeCollection {
  recipes: SimpleRecipe[]
  last_updated: string
}

// Weekly Planning
export interface PlannedMeal {
  id: string
  day: DayOfWeek
  meal_type: MealType
  recipe_id: string
  recipe_title: string
  servings: number
  completed: boolean
  completed_by?: UserId
  completed_at?: string
}

export interface WeeklyPlan {
  id: string
  week_of: string // ISO date (2025-01-06)
  meals: PlannedMeal[]
  shopping_list_generated: boolean
  created_by: UserId
  created_at: string
  status: 'draft' | 'active' | 'completed'
}

// Shopping System
export interface ShoppingItem {
  id: string
  name: string
  amount: number
  unit: string
  category: string
  checked: boolean
  needed_for: string[] // recipe IDs that require this ingredient
  checked_by?: UserId
  checked_at?: string
  pantry_item_id?: string // Links to pantry item for automatic updates
}

export interface ShoppingList {
  id: string
  week_plan_id: string
  items: ShoppingItem[]
  generated_at: string
  completed_items: number
  total_items: number
}

// Sync and Storage
export interface SyncMetadata {
  pantry_last_sync: string
  recipes_last_sync: string
  current_week_last_sync: string
  shopping_list_last_sync: string
  last_sync_by: UserId
}

export interface AppData {
  pantry: SimplePantryInventory
  recipes: RecipeCollection
  current_week: WeeklyPlan
  shopping_list: ShoppingList
  sync_metadata: SyncMetadata
}

// UI State
export type AppView = 'pantry' | 'recipes' | 'this-week' | 'shopping'

export interface AppState {
  current_view: AppView
  pantry_filter_category?: string
  recipe_filter: 'all' | 'can-make' | 'missing-ingredients'
  shopping_show_checked: boolean
}

// Claude Code Integration
export interface ClaudeContext {
  pantry_summary: {
    available_ingredients: Record<string, {amount: number, unit: string}>
    categories: Record<string, string[]>
    low_stock_items: string[]
  }
  recent_recipes: SimpleRecipe[]
  current_meal_plan: WeeklyPlan
  dietary_preferences: string[]
  household_size: number
}

// Default categories for pantry organization
export const DEFAULT_CATEGORIES: Omit<PantryCategory, 'items'>[] = [
  { id: 'vegetables', name: 'Vegetables', emoji: '🥬' },
  { id: 'fruits', name: 'Fruits', emoji: '🍎' },
  { id: 'proteins', name: 'Proteins', emoji: '🥩' },
  { id: 'dairy', name: 'Dairy & Eggs', emoji: '🥛' },
  { id: 'grains', name: 'Grains & Breads', emoji: '🍞' },
  { id: 'pantry', name: 'Pantry Staples', emoji: '🥫' },
  { id: 'spices', name: 'Spices & Seasonings', emoji: '🧂' },
  { id: 'oils', name: 'Oils & Condiments', emoji: '🫒' }
]

// Common units for ingredients
export const COMMON_UNITS = [
  'items', 'cups', 'tbsp', 'tsp', 'lbs', 'oz', 'g', 'kg', 
  'ml', 'l', 'cans', 'bottles', 'packages', 'bunches', 'heads', 'cloves', 'ears'
] as const

export type CommonUnit = typeof COMMON_UNITS[number]