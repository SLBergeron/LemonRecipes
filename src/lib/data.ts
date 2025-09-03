import type { MealPlan } from "@/types"
import mealPlanData from "@/data/meal-plan-2025-09-03.json"

// Load meal plan data
export function getCurrentMealPlan(): MealPlan {
  return mealPlanData as MealPlan
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