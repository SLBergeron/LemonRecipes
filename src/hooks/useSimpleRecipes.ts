import { useState, useEffect, useCallback } from 'react'
import type { 
  SimpleRecipe, 
  RecipeCollection, 
  SimplePantryInventory 
} from '@/types/simple'
import { 
  createRecipe, 
  generateId, 
  getCurrentUser,
  calculateRecipeAvailability 
} from '@/lib/simple-utils'

export function useSimpleRecipes(pantry: SimplePantryInventory | null) {
  const [recipes, setRecipes] = useState<SimpleRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load recipes on mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true)
        
        // Try localStorage first
        const localData = localStorage.getItem('simple-recipes')
        if (localData) {
          const parsed: RecipeCollection = JSON.parse(localData)
          setRecipes(parsed.recipes)
          setLoading(false)
          return
        }

        // Try to load existing recipe data
        try {
          const response = await fetch('./data/recipes.json')
          if (response.ok) {
            const existingData = await response.json()
            const convertedRecipes = convertExistingRecipeData(existingData)
            const collection: RecipeCollection = {
              recipes: convertedRecipes,
              last_updated: new Date().toISOString()
            }
            setRecipes(convertedRecipes)
            saveRecipesToStorage(collection)
          } else {
            throw new Error('No existing recipes')
          }
        } catch {
          // Initialize with empty recipe collection
          const collection: RecipeCollection = {
            recipes: [],
            last_updated: new Date().toISOString()
          }
          setRecipes([])
          saveRecipesToStorage(collection)
        }
      } catch (err) {
        console.error('Failed to load recipes:', err)
        setError('Failed to load recipes')
        setRecipes([])
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [])

  // Calculate availability for all recipes when pantry changes
  useEffect(() => {
    if (!pantry) return

    setRecipes(prev => prev.map(recipe => {
      const availability = calculateRecipeAvailability(recipe, pantry)
      return {
        ...recipe,
        can_make: availability.can_make,
        missing_ingredients: availability.missing_ingredients
      }
    }))
  }, [pantry])

  // Save recipes to localStorage
  const saveRecipesToStorage = useCallback((collection: RecipeCollection) => {
    try {
      localStorage.setItem('simple-recipes', JSON.stringify(collection))
    } catch (err) {
      console.error('Failed to save recipes to localStorage:', err)
    }
  }, [])

  // Add new recipe
  const addRecipe = useCallback(async (
    title: string,
    ingredients: { name: string; amount: number; unit: string; optional?: boolean }[],
    instructions: string[],
    servings: number = 4,
    prepTime: number = 0,
    cookTime: number = 0
  ): Promise<SimpleRecipe> => {
    const newRecipe = createRecipe(title, ingredients, instructions, servings, prepTime, cookTime)
    
    // Calculate availability if pantry is loaded
    if (pantry) {
      const availability = calculateRecipeAvailability(newRecipe, pantry)
      newRecipe.can_make = availability.can_make
      newRecipe.missing_ingredients = availability.missing_ingredients
    }

    const updatedRecipes = [...recipes, newRecipe]
    setRecipes(updatedRecipes)

    const collection: RecipeCollection = {
      recipes: updatedRecipes,
      last_updated: new Date().toISOString()
    }
    saveRecipesToStorage(collection)

    return newRecipe
  }, [recipes, pantry, saveRecipesToStorage])

  // Update existing recipe
  const updateRecipe = useCallback(async (recipeId: string, updates: Partial<SimpleRecipe>): Promise<SimpleRecipe> => {
    const updatedRecipes = recipes.map(recipe => {
      if (recipe.id === recipeId) {
        const updatedRecipe = { ...recipe, ...updates }
        
        // Recalculate availability if pantry is loaded
        if (pantry) {
          const availability = calculateRecipeAvailability(updatedRecipe, pantry)
          updatedRecipe.can_make = availability.can_make
          updatedRecipe.missing_ingredients = availability.missing_ingredients
        }
        
        return updatedRecipe
      }
      return recipe
    })

    const updatedRecipe = updatedRecipes.find(r => r.id === recipeId)
    if (!updatedRecipe) throw new Error('Recipe not found')

    setRecipes(updatedRecipes)

    const collection: RecipeCollection = {
      recipes: updatedRecipes,
      last_updated: new Date().toISOString()
    }
    saveRecipesToStorage(collection)

    return updatedRecipe
  }, [recipes, pantry, saveRecipesToStorage])

  // Delete recipe
  const deleteRecipe = useCallback(async (recipeId: string): Promise<void> => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId)
    setRecipes(updatedRecipes)

    const collection: RecipeCollection = {
      recipes: updatedRecipes,
      last_updated: new Date().toISOString()
    }
    saveRecipesToStorage(collection)
  }, [recipes, saveRecipesToStorage])

  // Get recipes by availability
  const getRecipesByAvailability = useCallback((canMake?: boolean): SimpleRecipe[] => {
    if (canMake === undefined) return recipes
    return recipes.filter(recipe => recipe.can_make === canMake)
  }, [recipes])

  // Get recipes by tags
  const getRecipesByTag = useCallback((tag: string): SimpleRecipe[] => {
    return recipes.filter(recipe => recipe.tags.includes(tag))
  }, [recipes])

  // Get recipe statistics
  const getStats = useCallback(() => {
    return {
      totalRecipes: recipes.length,
      canMakeCount: recipes.filter(r => r.can_make).length,
      missingIngredientsCount: recipes.filter(r => !r.can_make).length
    }
  }, [recipes])

  // Convert existing recipe data to new format
  const convertExistingRecipeData = (existingData: any): SimpleRecipe[] => {
    if (!existingData?.recipes) return []
    
    return existingData.recipes.map((recipe: any) => ({
      id: recipe.id || generateId(),
      title: recipe.title || recipe.name || 'Untitled Recipe',
      servings: recipe.servings || 4,
      prep_time: recipe.prep_time || recipe.prepTime || 0,
      cook_time: recipe.cook_time || recipe.cookTime || 0,
      ingredients: (recipe.ingredients || []).map((ing: any) => ({
        name: ing.name || ing.ingredient || '',
        amount: parseFloat(ing.amount) || 1,
        unit: ing.unit || 'items',
        optional: ing.optional || false
      })),
      instructions: Array.isArray(recipe.instructions) 
        ? recipe.instructions.filter(Boolean)
        : recipe.instructions ? [recipe.instructions] : [],
      tags: recipe.tags || [],
      created_by: getCurrentUser(),
      created_at: recipe.created_at || new Date().toISOString(),
      can_make: false,
      missing_ingredients: []
    }))
  }

  return {
    recipes,
    loading,
    error,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipesByAvailability,
    getRecipesByTag,
    getStats
  }
}