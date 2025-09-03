// TypeScript types for LemonRecipes data structures

export interface Ingredient {
  reminder_id: string
  name: string
  french_name: string
  quantity: string
  avg_price_farmboy: number
  avg_price_butcher?: number
  avg_price_farmers_market?: number
  category: string
  seasonal?: boolean
  notes?: string
}

export interface MealPlan {
  id: string
  title: string
  date: string
  season: 'spring' | 'summer' | 'fall' | 'winter'
  farmers_market_available: boolean
  budget_target: number
  estimated_cost: number
  prep_time_total: string
  shopping_locations: string[]
  tags: string[]
  meal_prep_friendly: boolean
  leftover_integration: boolean
  author: string
  active_ingredients: string[]
  
  // Content sections
  strategy: StrategyCard[]
  batch_sauces: Recipe[]
  meals: MealCard[]
  grocery_categories: GroceryCategory[]
  timeline: TimelineItem[]
}

export interface StrategyCard {
  emoji: string
  title: string
  description: string
  color?: string
}

export interface Recipe {
  id: string
  number?: number | string
  emoji: string
  title: string
  time: string
  uses: string
  ingredients: string
  method: string
  color?: string
}

export interface MealCard {
  id: string
  day: string
  day_letter: string
  emoji: string
  title: string
  protein: string
  sides: string
  prep: string
  sauce?: string
  notes?: string
}

export interface GroceryCategory {
  id: string
  title: string
  emoji: string
  color: string
  items: GroceryItem[]
}

export interface GroceryItem {
  id: string
  name: string
  quantity?: string
  price: number
  checked?: boolean
  notes?: string
}

export interface TimelineItem {
  id: string
  time: string
  emoji: string
  title: string
  duration: string
  tasks: Task[]
}

export interface Task {
  id: string
  description: string
  completed?: boolean
}

// Apple Shortcuts integration
export interface ShortcutsData {
  week_id: string
  active_items: string[]
  budget_target: number
  estimated_cost: number
  theme: string
}

// Local storage state
export interface AppState {
  currentMealPlan?: string
  groceryCheckedItems: Record<string, boolean>
  taskCompletedItems: Record<string, boolean>
  preferences: {
    darkMode: boolean
    defaultView: 'meal-plan' | 'grocery-list' | 'timeline'
  }
}