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
  getWeekOf,
  deductIngredientsFromPantry 
} from '@/lib/simple-utils'

export function useWeeklyPlan(
  recipes: SimpleRecipe[], 
  pantry: SimplePantryInventory | null,
  updatePantry?: (updatedPantry: SimplePantryInventory) => void
) {
  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan | null>(null)
  const [currentWeek, setCurrentWeek] = useState(getWeekOf())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load weekly plan (triggered when currentWeek changes)
  useEffect(() => {
    const loadWeeklyPlan = async () => {
      try {
        setLoading(true)
        
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
        const fallbackPlan = createWeeklyPlan(currentWeek)
        setCurrentPlan(fallbackPlan)
      } finally {
        setLoading(false)
      }
    }

    loadWeeklyPlan()
  }, [currentWeek])

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

    // Find the meal being completed
    const meal = currentPlan.meals.find(m => m.id === mealId)
    if (!meal) return

    // If marking as completed and we have pantry and recipe data, deduct ingredients
    if (completed && pantry && updatePantry) {
      const recipe = recipes.find(r => r.id === meal.recipe_id)
      if (recipe) {
        console.log(`Meal completed: ${meal.recipe_title} (${meal.servings} servings)`)
        console.log('Deducting ingredients from pantry...')
        
        try {
          const updatedPantry = deductIngredientsFromPantry(recipe, pantry, meal.servings)
          updatePantry(updatedPantry)
          console.log('Pantry updated successfully')
        } catch (error) {
          console.error('Failed to update pantry:', error)
        }
      }
    }

    const updatedPlan: WeeklyPlan = {
      ...currentPlan,
      meals: currentPlan.meals.map(m => 
        m.id === mealId 
          ? { 
              ...m, 
              completed, 
              completed_by: completed ? ('simon' as const) : undefined,
              completed_at: completed ? new Date().toISOString() : undefined
            }
          : m
      )
    }

    setCurrentPlan(updatedPlan)
    saveWeeklyPlan(updatedPlan)
  }, [currentPlan, saveWeeklyPlan, pantry, updatePantry, recipes])

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

  // Week navigation functions
  const goToPreviousWeek = useCallback(() => {
    const prevWeekDate = new Date(currentWeek)
    prevWeekDate.setDate(prevWeekDate.getDate() - 7)
    const prevWeek = getWeekOf(prevWeekDate)
    setCurrentWeek(prevWeek)
  }, [currentWeek])

  const goToNextWeek = useCallback(() => {
    const nextWeekDate = new Date(currentWeek)
    nextWeekDate.setDate(nextWeekDate.getDate() + 7)
    const nextWeek = getWeekOf(nextWeekDate)
    setCurrentWeek(nextWeek)
  }, [currentWeek])

  const goToCurrentWeek = useCallback(() => {
    setCurrentWeek(getWeekOf())
  }, [])

  return {
    currentPlan,
    currentWeek,
    loading,
    error,
    addMealToPlan: addMealToWeeklyPlan,
    removeMealFromPlan,
    markMealCompleted,
    getMealsForDay,
    getPlanStats,
    createNextWeekPlan,
    loadWeekPlan,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek
  }
}