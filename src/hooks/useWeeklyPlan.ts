import { useState, useEffect, useCallback } from 'react'
import type { 
  WeeklyPlan, 
  PlannedMeal, 
  SimpleRecipe, 
  SimplePantryInventory,
  DayOfWeek,
  MealType 
} from '@/types/simple'
import { 
  createWeeklyPlan, 
  getWeekOf 
} from '@/lib/simple-utils'

export function useWeeklyPlan(
  recipes: SimpleRecipe[], 
  _pantry: SimplePantryInventory | null
) {
  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load current week's plan
  useEffect(() => {
    const loadWeeklyPlan = async () => {
      try {
        setLoading(true)
        const currentWeek = getWeekOf()
        
        // Try localStorage first
        const localData = localStorage.getItem(`weekly-plan-${currentWeek}`)
        if (localData) {
          const parsed: WeeklyPlan = JSON.parse(localData)
          setCurrentPlan(parsed)
          setLoading(false)
          return
        }

        // Create new plan for this week
        const newPlan = createWeeklyPlan(currentWeek)
        setCurrentPlan(newPlan)
        saveWeeklyPlan(newPlan)
        
      } catch (err) {
        console.error('Failed to load weekly plan:', err)
        setError('Failed to load weekly plan')
        // Fallback to empty plan
        const currentWeek = getWeekOf()
        const fallbackPlan = createWeeklyPlan(currentWeek)
        setCurrentPlan(fallbackPlan)
      } finally {
        setLoading(false)
      }
    }

    loadWeeklyPlan()
  }, [])

  // Save plan to localStorage
  const saveWeeklyPlan = useCallback((plan: WeeklyPlan) => {
    try {
      localStorage.setItem(`weekly-plan-${plan.week_of}`, JSON.stringify(plan))
      // Also save as "current" plan
      localStorage.setItem('current-weekly-plan', JSON.stringify(plan))
    } catch (err) {
      console.error('Failed to save weekly plan:', err)
    }
  }, [])

  // Add meal to plan  
  const addMealToWeeklyPlan = useCallback(async (
    day: DayOfWeek,
    mealType: MealType,
    recipeId: string,
    servings: number = 4
  ) => {
    if (!currentPlan) return

    const recipe = recipes.find(r => r.id === recipeId)
    if (!recipe) {
      throw new Error('Recipe not found')
    }

    const updatedPlan: WeeklyPlan = {
      ...currentPlan,
      meals: [...currentPlan.meals, {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        day,
        meal_type: mealType,
        recipe_id: recipeId,
        recipe_title: recipe.title,
        servings,
        completed: false
      }]
    }

    setCurrentPlan(updatedPlan)
    saveWeeklyPlan(updatedPlan)
  }, [currentPlan, recipes, saveWeeklyPlan])

  // Remove meal from plan
  const removeMealFromPlan = useCallback(async (mealId: string) => {
    if (!currentPlan) return

    const updatedPlan = {
      ...currentPlan,
      meals: currentPlan.meals.filter(meal => meal.id !== mealId)
    }

    setCurrentPlan(updatedPlan)
    saveWeeklyPlan(updatedPlan)
  }, [currentPlan, saveWeeklyPlan])

  // Mark meal as completed
  const markMealCompleted = useCallback(async (mealId: string, completed: boolean) => {
    if (!currentPlan) return

    const updatedPlan: WeeklyPlan = {
      ...currentPlan,
      meals: currentPlan.meals.map(meal => 
        meal.id === mealId 
          ? { 
              ...meal, 
              completed, 
              completed_by: completed ? ('simon' as const) : undefined,
              completed_at: completed ? new Date().toISOString() : undefined
            }
          : meal
      )
    }

    setCurrentPlan(updatedPlan)
    saveWeeklyPlan(updatedPlan)
  }, [currentPlan, saveWeeklyPlan])

  // Get meals for a specific day
  const getMealsForDay = useCallback((day: DayOfWeek): PlannedMeal[] => {
    if (!currentPlan) return []
    return currentPlan.meals.filter(meal => meal.day === day)
  }, [currentPlan])

  // Get plan statistics
  const getPlanStats = useCallback(() => {
    if (!currentPlan) return { totalMeals: 0, completedMeals: 0, uniqueRecipes: 0 }

    const totalMeals = currentPlan.meals.length
    const completedMeals = currentPlan.meals.filter(meal => meal.completed).length
    const uniqueRecipeIds = new Set(currentPlan.meals.map(meal => meal.recipe_id))
    
    return {
      totalMeals,
      completedMeals,
      uniqueRecipes: uniqueRecipeIds.size
    }
  }, [currentPlan])

  // Create new plan for next week
  const createNextWeekPlan = useCallback(async () => {
    const currentWeek = getWeekOf()
    const nextWeekDate = new Date(currentWeek)
    nextWeekDate.setDate(nextWeekDate.getDate() + 7)
    const nextWeek = getWeekOf(nextWeekDate)
    
    const newPlan = createWeeklyPlan(nextWeek)
    
    // Save new plan
    saveWeeklyPlan(newPlan)
    
    // Switch to new plan
    setCurrentPlan(newPlan)
    
    return newPlan
  }, [saveWeeklyPlan])

  // Load plan for specific week
  const loadWeekPlan = useCallback(async (weekOf: string) => {
    try {
      setLoading(true)
      
      const localData = localStorage.getItem(`weekly-plan-${weekOf}`)
      if (localData) {
        const parsed: WeeklyPlan = JSON.parse(localData)
        setCurrentPlan(parsed)
      } else {
        // Create new plan for requested week
        const newPlan = createWeeklyPlan(weekOf)
        setCurrentPlan(newPlan)
        saveWeeklyPlan(newPlan)
      }
    } catch (err) {
      console.error('Failed to load week plan:', err)
      setError('Failed to load week plan')
    } finally {
      setLoading(false)
    }
  }, [saveWeeklyPlan])

  return {
    currentPlan,
    loading,
    error,
    addMealToPlan: addMealToWeeklyPlan,
    removeMealFromPlan,
    markMealCompleted,
    getMealsForDay,
    getPlanStats,
    createNextWeekPlan,
    loadWeekPlan
  }
}