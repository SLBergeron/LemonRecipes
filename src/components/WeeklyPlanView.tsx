import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Check, Clock, Users, Trash2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
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
  const { pantry, updatePantry } = useSimplePantry()
  const { recipes } = useSimpleRecipes(pantry)
  const {
    currentPlan,
    currentWeek,
    loading,
    error,
    addMealToPlan,
    removeMealFromPlan,
    markMealCompleted,
    getMealsForDay,
    getPlanStats,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek
  } = useWeeklyPlan(recipes, pantry, updatePantry)

  const [showAddMeal, setShowAddMeal] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showRecipeViewer, setShowRecipeViewer] = useState(false)
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday')
  const [selectedMealType, setSelectedMealType] = useState<MealType>('dinner')
  const [selectedRecipe, setSelectedRecipe] = useState<string>('')
  const [viewingRecipe, setViewingRecipe] = useState<string | null>(null)
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

  const handleQuickAddMeal = (day: DayOfWeek, mealType: MealType = 'dinner') => {
    setSelectedDay(day)
    setSelectedMealType(mealType)
    setSelectedRecipe('')
    setShowQuickAdd(true)
  }

  const handleQuickAddSubmit = async () => {
    if (!selectedRecipe) return
    
    try {
      await addMealToPlan(selectedDay, selectedMealType, selectedRecipe, servings)
      setShowQuickAdd(false)
      setSelectedRecipe('')
    } catch (err) {
      console.error('Failed to add meal:', err)
    }
  }

  const handleViewRecipe = (recipeId: string) => {
    setViewingRecipe(recipeId)
    setShowRecipeViewer(true)
  }

  return (
    <div className="space-y-6">
      {/* Header with Week Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">Week of {formatWeekRange(currentWeek)}</h2>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToCurrentWeek} title="Go to current week">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground">Plan your meals for the week</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddMeal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Meal
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

      {/* Quick Add Meal Modal */}
      {showQuickAdd && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Quick Add Meal - {DAYS.find(d => d.id === selectedDay)?.name}</CardTitle>
            <CardDescription>Quickly add a recipe to your meal plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Servings</label>
                <Select value={servings.toString()} onValueChange={(value) => setServings(parseInt(value))}>
                  <SelectTrigger>
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

            <div className="flex gap-2">
              <Button onClick={handleQuickAddSubmit} disabled={!selectedRecipe} className="bg-blue-600 hover:bg-blue-700">
                Add to {DAYS.find(d => d.id === selectedDay)?.name}
              </Button>
              <Button variant="outline" onClick={() => setShowQuickAdd(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recipe Viewer Modal */}
      {showRecipeViewer && viewingRecipe && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center justify-between">
              <span>Recipe Details</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowRecipeViewer(false)}
                className="text-green-600 hover:text-green-800"
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const recipe = recipes.find(r => r.id === viewingRecipe)
              if (!recipe) {
                return <p className="text-muted-foreground">Recipe not found</p>
              }
              
              return (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">{recipe.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span>Serves {recipe.servings}</span>
                      {recipe.prep_time > 0 && <span>Prep: {recipe.prep_time}m</span>}
                      {recipe.cook_time > 0 && <span>Cook: {recipe.cook_time}m</span>}
                      <Badge variant={recipe.can_make ? "default" : "destructive"}>
                        {recipe.can_make ? "Can Make" : "Missing Ingredients"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Ingredients:</h4>
                    <div className="grid gap-1">
                      {recipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="text-sm flex justify-between">
                          <span>{ingredient.name}</span>
                          <span className="text-muted-foreground">
                            {ingredient.amount} {ingredient.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {recipe.instructions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Instructions:</h4>
                      <ol className="list-decimal list-inside space-y-1">
                        {recipe.instructions.map((instruction, index) => (
                          <li key={index} className="text-sm break-words">
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )
            })()}
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
                          className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg ${
                            meal.completed ? 'bg-green-50 border-green-200' : ''
                          }`}
                        >
                          <button
                            onClick={() => handleToggleCompleted(meal.id, !meal.completed)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              meal.completed 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300 hover:border-green-400'
                            }`}
                          >
                            {meal.completed && <Check className="h-3 w-3" />}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-1 flex-wrap">
                              <span className="text-lg flex-shrink-0">{mealType?.icon}</span>
                              <button
                                onClick={() => handleViewRecipe(meal.recipe_id)}
                                className={`font-medium text-left hover:text-blue-600 underline-offset-2 hover:underline flex-1 min-w-0 ${
                                  meal.completed ? 'line-through text-muted-foreground' : ''
                                }`}
                                title="Click to view recipe"
                              >
                                <span className="break-words">{meal.recipe_title}</span>
                              </button>
                              {!recipe?.can_make && (
                                <Badge variant="outline" className="text-orange-600 text-xs whitespace-nowrap">
                                  Missing ingredients
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap mt-1">
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
                  <button
                    onClick={() => handleQuickAddMeal(day.id)}
                    className="w-full text-center py-6 text-muted-foreground hover:bg-gray-50 rounded-lg transition-colors group"
                    title={`Click to add a meal for ${day.name}`}
                  >
                    <Plus className="h-8 w-8 mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <p>Click to add meal for {day.name}</p>
                    <p className="text-xs opacity-70 group-hover:opacity-100">Quick add recipes</p>
                  </button>
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