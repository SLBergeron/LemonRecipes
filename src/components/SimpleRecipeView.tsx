import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, BookOpen, CheckCircle, AlertCircle, Clock, Users, Package } from "lucide-react"
import { useSimpleRecipes } from '@/hooks/useSimpleRecipes'
import { useSimplePantry } from '@/hooks/useSimplePantry'
import { PantryIngredientPicker } from '@/components/PantryIngredientPicker'
import { COMMON_UNITS } from '@/types/simple'
import type { SimpleRecipe, RecipeIngredient } from '@/types/simple'

type RecipeFilter = 'all' | 'can-make' | 'missing-ingredients'

export function SimpleRecipeView() {
  const { pantry } = useSimplePantry()
  const { 
    recipes, 
    loading, 
    error, 
    addRecipe, 
    deleteRecipe, 
    getRecipesByAvailability, 
    getStats 
  } = useSimpleRecipes(pantry)

  const [filter, setFilter] = useState<RecipeFilter>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<SimpleRecipe | null>(null)
  
  const [newRecipe, setNewRecipe] = useState<{
    title: string
    servings: number
    prepTime: number
    cookTime: number
    ingredients: RecipeIngredient[]
    instructions: string[]
  }>({
    title: '',
    servings: 4,
    prepTime: 0,
    cookTime: 0,
    ingredients: [{ name: '', amount: 1, unit: 'cups', optional: false }],
    instructions: ['']
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Loading recipes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  const stats = getStats()
  const displayRecipes = filter === 'all' 
    ? recipes 
    : filter === 'can-make'
      ? getRecipesByAvailability(true)
      : getRecipesByAvailability(false)

  const handleAddIngredient = () => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: 1, unit: 'cups', optional: false }]
    }))
  }

  const handleAddPantryIngredient = (ingredient: RecipeIngredient) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient]
    }))
  }

  const handleRemoveIngredient = (index: number) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  const handleUpdateIngredient = (index: number, field: string, value: any) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }))
  }

  const handleAddInstruction = () => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }))
  }

  const handleRemoveInstruction = (index: number) => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }))
  }

  const handleUpdateInstruction = (index: number, value: string) => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }))
  }

  const handleCreateRecipe = async () => {
    if (!newRecipe.title.trim()) return
    
    try {
      const validIngredients = newRecipe.ingredients.filter(ing => ing.name.trim())
      const validInstructions = newRecipe.instructions.filter(inst => inst.trim())
      
      if (validIngredients.length === 0 || validInstructions.length === 0) {
        alert('Please add at least one ingredient and one instruction')
        return
      }

      await addRecipe(
        newRecipe.title,
        validIngredients,
        validInstructions,
        newRecipe.servings,
        newRecipe.prepTime,
        newRecipe.cookTime
      )

      // Reset form
      setNewRecipe({
        title: '',
        servings: 4,
        prepTime: 0,
        cookTime: 0,
        ingredients: [{ name: '', amount: 1, unit: 'cups', optional: false }],
        instructions: ['']
      })
      setShowAddForm(false)
    } catch (err) {
      console.error('Failed to create recipe:', err)
    }
  }

  const handleDeleteRecipe = async (recipeId: string) => {
    if (confirm('Delete this recipe? This cannot be undone.')) {
      try {
        await deleteRecipe(recipeId)
        setSelectedRecipe(null)
      } catch (err) {
        console.error('Failed to delete recipe:', err)
      }
    }
  }

  if (selectedRecipe) {
    return <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} onDelete={handleDeleteRecipe} />
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalRecipes}</div>
            <p className="text-sm text-muted-foreground">Total Recipes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.canMakeCount}</div>
            <p className="text-sm text-muted-foreground">Can Make Now</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.missingIngredientsCount}</div>
            <p className="text-sm text-muted-foreground">Missing Ingredients</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(value: RecipeFilter) => setFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Recipes</SelectItem>
              <SelectItem value="can-make">Can Make Now</SelectItem>
              <SelectItem value="missing-ingredients">Missing Ingredients</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Recipe
        </Button>
      </div>

      {/* Add Recipe Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Recipe</CardTitle>
            <CardDescription>Create a new recipe for your collection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipe-title">Recipe Title</Label>
                <Input
                  id="recipe-title"
                  value={newRecipe.title}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Spaghetti Carbonara"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipe-servings">Servings</Label>
                <Input
                  id="recipe-servings"
                  type="number"
                  min="1"
                  max="20"
                  value={newRecipe.servings}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, servings: parseInt(e.target.value) || 4 }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prep-time">Prep Time (minutes)</Label>
                <Input
                  id="prep-time"
                  type="number"
                  min="0"
                  value={newRecipe.prepTime}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cook-time">Cook Time (minutes)</Label>
                <Input
                  id="cook-time"
                  type="number"
                  min="0"
                  value={newRecipe.cookTime}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Ingredients</Label>
                <div className="flex gap-2">
                  <PantryIngredientPicker 
                    pantry={pantry} 
                    onAddIngredient={handleAddPantryIngredient}
                  >
                    <Button variant="outline" size="sm">
                      <Package className="h-3 w-3 mr-1" />
                      From Pantry
                    </Button>
                  </PantryIngredientPicker>
                  <Button variant="outline" size="sm" onClick={handleAddIngredient}>
                    <Plus className="h-3 w-3 mr-1" />
                    Manual
                  </Button>
                </div>
              </div>
              
              {newRecipe.ingredients.map((ingredient, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5 space-y-1">
                    <Input
                      value={ingredient.name}
                      onChange={(e) => handleUpdateIngredient(index, 'name', e.target.value)}
                      placeholder="Ingredient name"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={ingredient.amount}
                      onChange={(e) => handleUpdateIngredient(index, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="Amount"
                    />
                  </div>
                  <div className="col-span-3 space-y-1">
                    <Select 
                      value={ingredient.unit} 
                      onValueChange={(value) => handleUpdateIngredient(index, 'unit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_UNITS.map(unit => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    {newRecipe.ingredients.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={ingredient.optional}
                      onChange={(e) => handleUpdateIngredient(index, 'optional', e.target.checked)}
                      className="rounded"
                    />
                    <Label className="ml-1 text-xs text-muted-foreground">Optional</Label>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Instructions</Label>
                <Button variant="outline" size="sm" onClick={handleAddInstruction}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Step
                </Button>
              </div>
              
              {newRecipe.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium mt-1">
                    {index + 1}
                  </div>
                  <Textarea
                    value={instruction}
                    onChange={(e) => handleUpdateInstruction(index, e.target.value)}
                    placeholder={`Step ${index + 1} instructions...`}
                    rows={2}
                    className="flex-1"
                  />
                  {newRecipe.instructions.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveInstruction(index)}
                      className="text-destructive hover:text-destructive mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateRecipe} disabled={!newRecipe.title.trim()}>
                Create Recipe
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recipe List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayRecipes.map(recipe => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onClick={() => setSelectedRecipe(recipe)} 
          />
        ))}
      </div>

      {displayRecipes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {filter === 'all' ? 'No recipes yet' : 
             filter === 'can-make' ? 'No recipes you can make with current pantry' :
             'No recipes with missing ingredients'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Add your first recipe to get started!
          </p>
        </div>
      )}
    </div>
  )
}

interface RecipeCardProps {
  recipe: SimpleRecipe
  onClick: () => void
}

function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-medium leading-tight">{recipe.title}</h3>
          {recipe.can_make ? (
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {recipe.servings}
          </div>
          {(recipe.prep_time > 0 || recipe.cook_time > 0) && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {recipe.prep_time + recipe.cook_time}m
            </div>
          )}
        </div>
        
        <div className="text-sm">
          <Badge variant={recipe.can_make ? "default" : "secondary"}>
            {recipe.can_make ? 'Can Make' : (() => {
              // Count actual missing non-optional ingredients based on availability data
              const missingCount = recipe.ingredients.filter(ing => 
                !ing.optional && recipe.ingredient_availability?.[ing.name]?.available !== true
              ).length
              return `Missing ${missingCount} ingredients`
            })()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

interface RecipeDetailProps {
  recipe: SimpleRecipe
  onBack: () => void
  onDelete: (id: string) => void
}

function RecipeDetail({ recipe, onBack, onDelete }: RecipeDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Recipes
        </Button>
        <Button variant="ghost" onClick={() => onDelete(recipe.id)} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{recipe.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {recipe.servings} servings
                </div>
                {recipe.prep_time > 0 && (
                  <div>Prep: {recipe.prep_time}m</div>
                )}
                {recipe.cook_time > 0 && (
                  <div>Cook: {recipe.cook_time}m</div>
                )}
              </div>
            </div>
            <Badge variant={recipe.can_make ? "default" : "secondary"}>
              {recipe.can_make ? 'Can Make Now' : 'Missing Ingredients'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Ingredients */}
          <div>
            <h3 className="font-semibold mb-3">Ingredients</h3>
            <div className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => {
                const availability = recipe.ingredient_availability?.[ingredient.name]
                const isAvailable = availability?.available === true
                const isMissing = availability?.available === false && !ingredient.optional
                const isUnknown = !availability && !ingredient.optional
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`${ingredient.optional ? 'text-muted-foreground italic' : ''} ${
                      isMissing || isUnknown ? 'text-orange-700 font-medium' : ''
                    }`}>
                      {ingredient.amount} {ingredient.unit} {ingredient.name}
                      {ingredient.optional && ' (optional)'}
                    </span>
                    <div className="flex items-center gap-2">
                      {isMissing && (
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          Missing
                        </Badge>
                      )}
                      {isUnknown && (
                        <Badge variant="outline" className="text-gray-600 border-gray-200">
                          Unknown
                        </Badge>
                      )}
                      {isAvailable && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Available
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="font-semibold mb-3">Instructions</h3>
            <div className="space-y-3">
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="flex-1">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Ingredients Alert */}
          {!recipe.can_make && recipe.missing_ingredients && recipe.missing_ingredients.length > 0 && (
            <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Missing Ingredients:</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                {recipe.missing_ingredients.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}