import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Check, Clock, Users, Trash2, ChefHat } from "lucide-react"
import { useWeeklyPlan } from '@/hooks/useWeeklyPlan'
import { useSimpleRecipes } from '@/hooks/useSimpleRecipes'
import { useSimplePantry } from '@/hooks/useSimplePantry'
import { formatWeekRange } from '@/lib/simple-utils'
import type { DayOfWeek, MealType } from '@/types/simple'

const DAYS: { id: DayOfWeek; name: string; short: string }[] = [
  { id: 'monday', name: 'Monday', short: 'Mon' },
  { id: 'tuesday', name: 'Tuesday', short: 'Tue' },
  { id: 'wednesday', name: 'Wednesday', short: 'Wed' },
  { id: 'thursday', name: 'Thursday', short: 'Thu' },
  { id: 'friday', name: 'Friday', short: 'Fri' },
  { id: 'saturday', name: 'Saturday', short: 'Sat' },
  { id: 'sunday', name: 'Sunday', short: 'Sun' }
]

const MEAL_TYPES: { id: MealType; name: string; icon: string }[] = [
  { id: 'breakfast', name: 'Breakfast', icon: '🍳' },
  { id: 'lunch', name: 'Lunch', icon: '🥗' },
  { id: 'dinner', name: 'Dinner', icon: '🍽️' },
  { id: 'snack', name: 'Snack', icon: '🍎' }
]

export function WeeklyPlanView() {
  const { pantry } = useSimplePantry()
  const { recipes } = useSimpleRecipes(pantry)
  const {
    currentPlan,
    loading,
    error,
    addMealToPlan,
    removeMealFromPlan,
    markMealCompleted,
    getMealsForDay,
    getPlanStats,
    createNextWeekPlan
  } = useWeeklyPlan(recipes, pantry)

  const [showAddMeal, setShowAddMeal] = useState(false)
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday')
  const [selectedMealType, setSelectedMealType] = useState<MealType>('dinner')
  const [selectedRecipe, setSelectedRecipe] = useState<string>('')
  const [servings, setServings] = useState(4)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading meal plan...</p>
        </div>
      </div>
    )
  }

  if (error || !currentPlan) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <Calendar className="h-12 w-12 mx-auto text-destructive" />
          <p className="text-destructive">{error || 'Failed to load meal plan'}</p>
        </div>
      </div>
    )
  }

  const stats = getPlanStats()
  const availableRecipes = recipes.filter(recipe => recipe.can_make)
  const allRecipes = recipes

  const handleAddMeal = async () => {
    if (!selectedRecipe) return
    
    try {
      await addMealToPlan(selectedDay, selectedMealType, selectedRecipe, servings)
      setShowAddMeal(false)
      setSelectedRecipe('')
    } catch (err) {
      console.error('Failed to add meal:', err)
    }
  }

  const handleRemoveMeal = async (mealId: string) => {
    if (confirm('Remove this meal from your plan?')) {
      try {
        await removeMealFromPlan(mealId)
      } catch (err) {
        console.error('Failed to remove meal:', err)
      }
    }
  }

  const handleToggleCompleted = async (mealId: string, completed: boolean) => {
    try {
      await markMealCompleted(mealId, completed)
    } catch (err) {
      console.error('Failed to update meal status:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Week of {formatWeekRange(currentPlan.week_of)}</h2>
          <p className="text-muted-foreground">Plan your meals for the week</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddMeal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Meal
          </Button>
          <Button variant="outline" onClick={createNextWeekPlan}>
            Next Week
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalMeals}</div>
            <p className="text-sm text-muted-foreground">Planned Meals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completedMeals}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.uniqueRecipes}</div>
            <p className="text-sm text-muted-foreground">Unique Recipes</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Meal Form */}
      {showAddMeal && (
        <Card>
          <CardHeader>
            <CardTitle>Add Meal to Plan</CardTitle>
            <CardDescription>Schedule a recipe for a specific day and meal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Day</label>
                <Select value={selectedDay} onValueChange={(value: DayOfWeek) => setSelectedDay(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map(day => (
                      <SelectItem key={day.id} value={day.id}>
                        {day.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Meal Type</label>
                <Select value={selectedMealType} onValueChange={(value: MealType) => setSelectedMealType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEAL_TYPES.map(mealType => (
                      <SelectItem key={mealType.id} value={mealType.id}>
                        {mealType.icon} {mealType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recipe</label>
              <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a recipe" />
                </SelectTrigger>
                <SelectContent>
                  <div className="text-xs text-muted-foreground p-2 border-b">Can Make Now</div>
                  {availableRecipes.map(recipe => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      ✅ {recipe.title}
                    </SelectItem>
                  ))}
                  {availableRecipes.length === 0 && (
                    <div className="text-xs text-muted-foreground p-2">No recipes available with current pantry</div>
                  )}
                  
                  <div className="text-xs text-muted-foreground p-2 border-b border-t mt-2">All Recipes</div>
                  {allRecipes.filter(r => !r.can_make).map(recipe => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      ⚠️ {recipe.title} (missing ingredients)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Servings</label>
              <Select value={servings.toString()} onValueChange={(value) => setServings(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} servings
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddMeal} disabled={!selectedRecipe}>
                Add to Plan
              </Button>
              <Button variant="outline" onClick={() => setShowAddMeal(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Calendar */}
      <div className="grid gap-4">
        {DAYS.map(day => {
          const dayMeals = getMealsForDay(day.id)
          
          return (
            <Card key={day.id}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>{day.name}</span>
                  <Badge variant="secondary">{dayMeals.length} meals</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dayMeals.length > 0 ? (
                  <div className="space-y-3">
                    {dayMeals.map(meal => {
                      const recipe = recipes.find(r => r.id === meal.recipe_id)
                      const mealType = MEAL_TYPES.find(mt => mt.id === meal.meal_type)
                      
                      return (
                        <div 
                          key={meal.id} 
                          className={`flex items-center justify-between p-3 border rounded-lg ${
                            meal.completed ? 'bg-green-50 border-green-200' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleCompleted(meal.id, !meal.completed)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                meal.completed 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : 'border-gray-300 hover:border-green-400'
                              }`}
                            >
                              {meal.completed && <Check className="h-3 w-3" />}
                            </button>
                            
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                <span>{mealType?.icon}</span>
                                <span className={meal.completed ? 'line-through text-muted-foreground' : ''}>
                                  {meal.recipe_title}
                                </span>
                                {!recipe?.can_make && (
                                  <Badge variant="outline" className="text-orange-600">
                                    Missing ingredients
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-4">
                                <span className="capitalize">{meal.meal_type}</span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {meal.servings}
                                </span>
                                {recipe && (recipe.prep_time > 0 || recipe.cook_time > 0) && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {recipe.prep_time + recipe.cook_time}m
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveMeal(meal.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <ChefHat className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No meals planned for {day.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {stats.totalMeals === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No meals planned for this week</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add your first meal to get started!
          </p>
        </div>
      )}
    </div>
  )
}