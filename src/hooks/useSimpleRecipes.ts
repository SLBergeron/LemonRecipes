import { useState, useEffect, useCallback } from 'react'
import type { 
  SimpleRecipe, 
  RecipeCollection, 
  SimplePantryInventory 
} from '@/types/simple'
import { 
  createRecipe,
  calculateRecipeAvailability 
} from '@/lib/simple-utils'
import { sampleRecipes } from '@/data/sample-recipes'

export function useSimpleRecipes(pantry: SimplePantryInventory | null) {
  const [recipes, setRecipes] = useState<SimpleRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load recipes on mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true)
        
        // Clear localStorage to always load fresh from JSON files
        localStorage.removeItem('simple-recipes')

        // Load individual recipe JSON files
        try {
          console.log('Loading individual recipe JSON files...')
          
          // First, get the recipe index
          const indexResponse = await fetch('./data/recipes/index.json')
          if (!indexResponse.ok) {
            throw new Error('Recipe index not found')
          }
          
          const recipeIndex = await indexResponse.json()
          console.log(`Found ${recipeIndex.total_count} recipes to load`)
          
          // Load each individual recipe file
          const loadedRecipes: SimpleRecipe[] = []
          
          for (const filename of recipeIndex.recipes) {
            try {
              const recipeResponse = await fetch(`./data/recipes/${filename}`)
              if (recipeResponse.ok) {
                const recipe: SimpleRecipe = await recipeResponse.json()
                loadedRecipes.push(recipe)
              } else {
                console.warn(`Failed to load recipe: ${filename}`)
              }
            } catch (err) {
              console.warn(`Error loading recipe ${filename}:`, err)
            }
          }
          
          console.log(`Successfully loaded ${loadedRecipes.length} recipes`)
          
          if (loadedRecipes.length > 0) {
            const collection: RecipeCollection = {
              recipes: loadedRecipes,
              last_updated: new Date().toISOString()
            }
            setRecipes(loadedRecipes)
            saveRecipesToStorage(collection)
          } else {
            throw new Error('No recipes loaded')
          }
          
        } catch (err) {
          console.warn('Failed to load individual recipe files, falling back to sample recipes:', err)
          
          // Fall back to sample recipes
          const collection: RecipeCollection = {
            recipes: sampleRecipes,
            last_updated: new Date().toISOString()
          }
          setRecipes(sampleRecipes)
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
        missing_ingredients: availability.missing_ingredients,
        ingredient_availability: availability.ingredient_availability
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
      newRecipe.ingredient_availability = availability.ingredient_availability
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
          updatedRecipe.ingredient_availability = availability.ingredient_availability
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