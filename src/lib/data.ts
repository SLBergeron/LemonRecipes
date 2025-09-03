import type { MealPlan } from "@/types"

// Load meal plan data
export async function getCurrentMealPlan(): Promise<MealPlan> {
  try {
    const response = await fetch('./api/meal-plan-2025-09-03.json')
    if (!response.ok) {
      throw new Error(`Failed to load meal plan: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading meal plan:', error)
    // Return minimal fallback data
    return {
      id: 'fallback-2025-09-03',
      title: 'LemonRecipes Meal Plan',
      date: new Date().toISOString().split('T')[0],
      season: 'fall' as const,
      farmers_market_available: true,
      budget_target: 165,
      estimated_cost: 185,
      prep_time_total: '30 minutes',
      shopping_locations: ['Farm Boy'],
      tags: ['loading'],
      meal_prep_friendly: true,
      leftover_integration: true,
      author: 'LemonRecipes',
      active_ingredients: [],
      strategy: [
        {
          emoji: '🍋',
          title: 'Loading...',
          description: 'Meal plan data is loading...',
          color: '#FBD38D'
        }
      ],
      meals: [],
      batch_sauces: [],
      grocery_categories: [],
      timeline: []
    } as MealPlan
  }
}

// Calculate total grocery cost
export function calculateTotalCost(mealPlan: MealPlan): number {
  return mealPlan.grocery_categories.reduce((total, category) => {
    return total + category.items.reduce((categoryTotal, item) => {
      return categoryTotal + item.price
    }, 0)
  }, 0)
}

// Get budget progress percentage
export function getBudgetProgress(mealPlan: MealPlan): number {
  const totalCost = calculateTotalCost(mealPlan)
  return Math.round((totalCost / mealPlan.budget_target) * 100)
}

// Check if over budget
export function isOverBudget(mealPlan: MealPlan): boolean {
  return calculateTotalCost(mealPlan) > mealPlan.budget_target
}

// Get budget difference
export function getBudgetDifference(mealPlan: MealPlan): number {
  return calculateTotalCost(mealPlan) - mealPlan.budget_target
}

// Format currency
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

// Get total task count
export function getTotalTasks(mealPlan: MealPlan): number {
  return mealPlan.timeline.reduce((total, item) => {
    return total + item.tasks.length
  }, 0)
}

// Apple Shortcuts integration data
export function getShortcutsData(mealPlan: MealPlan) {
  return {
    week_id: mealPlan.id,
    active_items: mealPlan.active_ingredients,
    budget_target: mealPlan.budget_target,
    estimated_cost: calculateTotalCost(mealPlan),
    theme: mealPlan.title
  }
}