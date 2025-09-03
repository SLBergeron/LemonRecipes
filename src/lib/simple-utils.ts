import type { 
  SimplePantryItem, 
  SimpleRecipe, 
  RecipeIngredient,
  WeeklyPlan,
  ShoppingItem,
  UserId,
  DayOfWeek,
  MealType,
  ClaudeContext,
  SimplePantryInventory
} from '@/types/simple'

// Utility functions for the simplified pantry system

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function getCurrentUser(): UserId {
  // Simple user detection - could be enhanced with proper auth later
  const stored = localStorage.getItem('lemon-recipes-user')
  return (stored as UserId) || 'simon'
}

export function setCurrentUser(userId: UserId): void {
  localStorage.setItem('lemon-recipes-user', userId)
}

// Pantry utility functions
export function createPantryItem(
  name: string, 
  amount: number, 
  unit: string, 
  category: string
): SimplePantryItem {
  return {
    id: generateId(),
    name: name.trim(),
    current_amount: amount,
    unit: unit,
    category: category,
    added_by: getCurrentUser(),
    updated_at: new Date().toISOString()
  }
}

export function updatePantryItemAmount(item: SimplePantryItem, newAmount: number): SimplePantryItem {
  return {
    ...item,
    current_amount: Math.max(0, newAmount), // Prevent negative amounts
    updated_at: new Date().toISOString()
  }
}

export function isLowStock(item: SimplePantryItem): boolean {
  // More realistic low stock detection based on unit type and reasonable thresholds
  switch (item.unit) {
    case 'items':
    case 'heads':
    case 'ears':
    case 'cans':
    case 'bottles':
    case 'packages':
    case 'containers':
      return item.current_amount <= 1
    
    case 'lbs':
      return item.current_amount <= 1 // 1 pound or less
    
    case 'g':
      // Different thresholds for different types of items in grams
      if (item.current_amount > 1000) {
        return item.current_amount <= 200 // Large quantities (meat): 200g or less
      }
      return item.current_amount <= 25 // Small quantities (spices): 25g or less
    
    case 'ml':
      return item.current_amount <= 50 // 50ml or less for liquids
    
    case '%':
      return item.current_amount <= 10 // 10% or less remaining
    
    default:
      // For other units, use a conservative threshold
      return item.current_amount <= 2
  }
}

// Recipe utility functions
export function createRecipe(
  title: string,
  ingredients: RecipeIngredient[],
  instructions: string[],
  servings: number = 4,
  prepTime: number = 0,
  cookTime: number = 0
): SimpleRecipe {
  return {
    id: generateId(),
    title: title.trim(),
    servings,
    prep_time: prepTime,
    cook_time: cookTime,
    ingredients: ingredients.map(ing => ({
      ...ing,
      name: ing.name.trim()
    })),
    instructions: instructions.map(inst => inst.trim()).filter(Boolean),
    tags: [],
    created_by: getCurrentUser(),
    created_at: new Date().toISOString()
  }
}

export function calculateRecipeAvailability(
  recipe: SimpleRecipe, 
  pantry: SimplePantryInventory
): { can_make: boolean; missing_ingredients: string[]; ingredient_availability: Record<string, { available: boolean; pantry_item_id?: string; reason?: string }> } {
  const missing: string[] = []
  const ingredient_availability: Record<string, { available: boolean; pantry_item_id?: string; reason?: string }> = {}
  const pantryItems = pantry.categories.flatMap(cat => cat.items)
  
  console.log(`🔍 Checking availability for recipe: ${recipe.title}`)
  
  for (const ingredient of recipe.ingredients) {
    if (ingredient.optional) {
      console.log(`  ⏭️  Skipping optional ingredient: ${ingredient.name}`)
      continue
    }
    
    console.log(`  📝 Checking: ${ingredient.name} (${ingredient.amount} ${ingredient.unit})`)
    
    // First try to find by pantry_item_id if provided
    let pantryItem = ingredient.pantry_item_id 
      ? pantryItems.find(item => item.id === ingredient.pantry_item_id)
      : null
    
    if (pantryItem) {
      console.log(`    ✅ Found by ID: ${pantryItem.name} (${pantryItem.current_amount} ${pantryItem.unit})`)
    }
    
    // Fall back to name matching if no pantry_item_id or not found
    if (!pantryItem) {
      console.log(`    🔍 Searching by name (pantry_item_id: ${ingredient.pantry_item_id || 'none'})`)
      pantryItem = pantryItems.find(item => 
        item.name.toLowerCase().includes(ingredient.name.toLowerCase()) ||
        ingredient.name.toLowerCase().includes(item.name.toLowerCase()) ||
        // Additional fuzzy matching
        normalizeIngredientName(item.name) === normalizeIngredientName(ingredient.name)
      )
      if (pantryItem) {
        console.log(`    ✅ Found by name: ${pantryItem.name} (${pantryItem.current_amount} ${pantryItem.unit})`)
      }
    }
    
    if (!pantryItem) {
      console.log(`    ❌ NOT FOUND: ${ingredient.name}`)
      missing.push(ingredient.name)
      ingredient_availability[ingredient.name] = {
        available: false,
        reason: 'Not found in pantry'
      }
      continue
    }
    
    // Check if we have enough quantity with unit matching
    const hasEnough = checkQuantityAvailability(ingredient, pantryItem)
    if (!hasEnough) {
      const shortageReason = `Need ${ingredient.amount} ${ingredient.unit}, have ${pantryItem.current_amount} ${pantryItem.unit}`
      console.log(`    ⚠️  INSUFFICIENT: ${shortageReason}`)
      missing.push(`${ingredient.name} (${shortageReason})`)
      ingredient_availability[ingredient.name] = {
        available: false,
        pantry_item_id: pantryItem.id,
        reason: shortageReason
      }
    } else {
      console.log(`    ✅ SUFFICIENT: ${ingredient.name}`)
      ingredient_availability[ingredient.name] = {
        available: true,
        pantry_item_id: pantryItem.id
      }
    }
  }
  
  console.log(`📊 Recipe ${recipe.title}: ${missing.length === 0 ? 'CAN MAKE' : `MISSING ${missing.length} ingredients`}`)
  
  return {
    can_make: missing.length === 0,
    missing_ingredients: missing,
    ingredient_availability
  }
}

function normalizeIngredientName(name: string): string {
  return name.toLowerCase()
    .replace(/\b(medium|large|small|whole|fresh|frozen|cooked)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function checkQuantityAvailability(ingredient: any, pantryItem: any): boolean {
  // If units match exactly, simple comparison
  if (ingredient.unit === pantryItem.unit) {
    return pantryItem.current_amount >= ingredient.amount
  }
  
  // Handle common unit conversions
  const convertedAmount = convertUnits(ingredient.amount, ingredient.unit, pantryItem.unit)
  if (convertedAmount !== null) {
    return pantryItem.current_amount >= convertedAmount
  }
  
  // If we can't convert units, assume we have enough (with warning in future)
  return true
}

function convertUnits(amount: number, fromUnit: string, toUnit: string): number | null {
  // Handle ml to ml conversions (already same)
  if (fromUnit === toUnit) return amount
  
  // Handle gram conversions
  if (fromUnit === 'g' && toUnit === 'g') return amount
  
  // Handle item/clove conversions for garlic
  if (fromUnit === 'cloves' && toUnit === 'cloves') return amount
  if (fromUnit === 'items' && toUnit === 'items') return amount
  
  // Add more conversions as needed
  return null
}

export function deductIngredientsFromPantry(
  recipe: SimpleRecipe, 
  pantry: SimplePantryInventory,
  servings: number = recipe.servings
): SimplePantryInventory {
  const scaleFactor = servings / recipe.servings
  
  const updatedCategories = pantry.categories.map(category => ({
    ...category,
    items: category.items.map(item => {
      // Find matching ingredient in recipe using the same logic as availability check
      const matchingIngredient = recipe.ingredients.find(ingredient => {
        if (ingredient.optional) return false
        
        // First try to match by pantry_item_id if provided
        if (ingredient.pantry_item_id && item.id === ingredient.pantry_item_id) {
          return true
        }
        
        // Fall back to name matching
        return item.name.toLowerCase().includes(ingredient.name.toLowerCase()) ||
               ingredient.name.toLowerCase().includes(item.name.toLowerCase()) ||
               normalizeIngredientName(item.name) === normalizeIngredientName(ingredient.name)
      })
      
      if (matchingIngredient) {
        // Use unit conversion to determine how much to deduct
        let amountToDeduct = 0
        const convertedAmount = convertUnits(matchingIngredient.amount * scaleFactor, matchingIngredient.unit, item.unit)
        
        if (convertedAmount !== null) {
          amountToDeduct = convertedAmount
        } else if (item.unit === matchingIngredient.unit) {
          amountToDeduct = matchingIngredient.amount * scaleFactor
        }
        // If we can't convert units, don't deduct anything (safer approach)
        
        if (amountToDeduct > 0) {
          console.log(`Deducting ${amountToDeduct} ${item.unit} of ${item.name} from pantry`)
          return updatePantryItemAmount(item, item.current_amount - amountToDeduct)
        }
      }
      
      return item
    })
  }))
  
  return {
    ...pantry,
    categories: updatedCategories,
    last_updated: new Date().toISOString()
  }
}

// Weekly planning utilities
export function createWeeklyPlan(weekOf: string): WeeklyPlan {
  return {
    id: generateId(),
    week_of: weekOf,
    meals: [],
    shopping_list_generated: false,
    created_by: getCurrentUser(),
    created_at: new Date().toISOString(),
    status: 'draft'
  }
}

export function addMealToPlan(
  plan: WeeklyPlan,
  day: DayOfWeek,
  mealType: MealType,
  recipeId: string,
  recipeTitle: string,
  servings: number = 4
): WeeklyPlan {
  const newMeal = {
    id: generateId(),
    day,
    meal_type: mealType,
    recipe_id: recipeId,
    recipe_title: recipeTitle,
    servings,
    completed: false
  }
  
  return {
    ...plan,
    meals: [...plan.meals, newMeal]
  }
}

// Check if an item is currently in season
export function isInSeason(item: SimplePantryItem, currentMonth: number = new Date().getMonth() + 1): boolean {
  if (!item.seasonal_availability) return true
  return item.seasonal_availability.months.includes(currentMonth)
}

// Get items that should auto-add to shopping when low
export function getAutoShoppingItems(pantry: SimplePantryInventory): SimplePantryItem[] {
  return pantry.categories
    .flatMap(cat => cat.items)
    .filter(item => item.auto_add_to_shopping && isLowStock(item))
}

// Enhanced shopping list generation with auto-shopping for missing ingredients
export function generateShoppingListFromRecipe(
  recipe: SimpleRecipe,
  pantry: SimplePantryInventory,
  servings: number = recipe.servings
): ShoppingItem[] {
  const scaleFactor = servings / recipe.servings
  const shoppingItems: ShoppingItem[] = []
  
  for (const ingredient of recipe.ingredients) {
    const scaledAmount = ingredient.amount * scaleFactor
    
    // Try to find matching pantry item
    let pantryItem: SimplePantryItem | undefined
    if (ingredient.pantry_item_id) {
      pantryItem = pantry.categories
        .flatMap(cat => cat.items)
        .find(item => item.id === ingredient.pantry_item_id)
    } else {
      // Fuzzy match by name
      pantryItem = pantry.categories
        .flatMap(cat => cat.items)
        .find(item => 
          item.name.toLowerCase().includes(ingredient.name.toLowerCase()) ||
          ingredient.name.toLowerCase().includes(item.name.toLowerCase())
        )
    }
    
    let needToBuy = false
    let amountToBuy = scaledAmount
    
    if (pantryItem) {
      // Check if we have enough in pantry
      const available = pantryItem.current_amount
      if (available < scaledAmount) {
        needToBuy = true
        const shortage = scaledAmount - available
        // Buy at least the minimum buy amount or the shortage, whichever is greater
        amountToBuy = Math.max(shortage, pantryItem.min_buy_amount || shortage)
      }
    } else {
      // Item not in pantry, need to buy
      needToBuy = true
    }
    
    if (needToBuy) {
      shoppingItems.push({
        id: generateId(),
        name: ingredient.name,
        amount: amountToBuy,
        unit: ingredient.unit,
        category: pantryItem?.category || categorizeIngredient(ingredient.name),
        checked: false,
        needed_for: [recipe.title],
        pantry_item_id: pantryItem?.id
      })
    }
  }
  
  return shoppingItems
}

export function generateShoppingListFromPlan(
  plan: WeeklyPlan,
  recipes: SimpleRecipe[],
  pantry: SimplePantryInventory
): ShoppingItem[] {
  const neededIngredients = new Map<string, {
    amount: number,
    unit: string,
    category: string,
    recipes: string[],
    pantryItemId?: string
  }>()
  
  // Collect all ingredients from planned meals
  for (const meal of plan.meals) {
    const recipe = recipes.find(r => r.id === meal.recipe_id)
    if (!recipe) continue
    
    const scaleFactor = meal.servings / recipe.servings
    
    for (const ingredient of recipe.ingredients) {
      const key = `${ingredient.name}-${ingredient.unit}`
      const existing = neededIngredients.get(key)
      const scaledAmount = ingredient.amount * scaleFactor
      
      if (existing) {
        existing.amount += scaledAmount
        existing.recipes.push(recipe.title)
      } else {
        neededIngredients.set(key, {
          amount: scaledAmount,
          unit: ingredient.unit,
          category: categorizeIngredient(ingredient.name),
          recipes: [recipe.title],
          pantryItemId: ingredient.pantry_item_id
        })
      }
    }
  }
  
  // Create shopping items, checking against pantry using improved matching
  const shoppingItems: ShoppingItem[] = []
  const pantryItems = pantry.categories.flatMap(cat => cat.items)
  
  for (const [ingredientKey, needed] of neededIngredients) {
    const ingredientName = ingredientKey.split('-')[0]
    
    // Use improved pantry matching logic (same as recipe availability)
    const pantryItem = pantryItems.find(item => 
      item.name.toLowerCase().includes(ingredientName.toLowerCase()) ||
      ingredientName.toLowerCase().includes(item.name.toLowerCase()) ||
      normalizeIngredientName(item.name) === normalizeIngredientName(ingredientName)
    )
    
    let amountToBuy = needed.amount
    
    if (pantryItem) {
      // Use unit conversion if available
      const convertedAmount = convertUnits(needed.amount, needed.unit, pantryItem.unit)
      if (convertedAmount !== null) {
        amountToBuy = Math.max(0, convertedAmount - pantryItem.current_amount)
        // Convert back to recipe unit for shopping list
        const shoppingAmount = convertUnits(amountToBuy, pantryItem.unit, needed.unit)
        amountToBuy = shoppingAmount !== null ? shoppingAmount : amountToBuy
      } else if (pantryItem.unit === needed.unit) {
        amountToBuy = Math.max(0, needed.amount - pantryItem.current_amount)
      }
    }
    
    if (amountToBuy > 0) {
      // Use minimum buy amount if pantry item has one and we need to buy
      let finalAmountToBuy = amountToBuy
      if (pantryItem?.min_buy_amount && finalAmountToBuy < pantryItem.min_buy_amount) {
        finalAmountToBuy = pantryItem.min_buy_amount
      }
      
      shoppingItems.push({
        id: generateId(),
        name: ingredientName,
        amount: Math.ceil(finalAmountToBuy * 100) / 100, // Round to 2 decimal places for shopping
        unit: needed.unit,
        category: needed.category,
        checked: false,
        needed_for: needed.recipes,
        pantry_item_id: pantryItem?.id
      })
    }
  }

  // Add auto-shopping items for low stock pantry items
  const autoShoppingItems = getAutoShoppingItems(pantry).map(item => ({
    id: generateId(),
    name: item.name,
    amount: item.normal_restock_level || item.min_buy_amount || item.current_amount * 2,
    unit: item.unit,
    category: item.category,
    checked: false,
    needed_for: ['Low Stock Auto-Restock'],
    pantry_item_id: item.id
  }))

  // Merge with existing shopping items, avoiding duplicates
  const allItems = [...shoppingItems]
  for (const autoItem of autoShoppingItems) {
    const existing = allItems.find(item => item.pantry_item_id === autoItem.pantry_item_id)
    if (!existing) {
      allItems.push(autoItem)
    }
  }

  return allItems.sort((a, b) => a.category.localeCompare(b.category))
}

function categorizeIngredient(ingredientName: string): string {
  const name = ingredientName.toLowerCase()
  
  if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || 
      name.includes('fish') || name.includes('salmon') || name.includes('meat')) {
    return 'proteins'
  }
  
  if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || 
      name.includes('egg') || name.includes('butter') || name.includes('cream')) {
    return 'dairy'
  }
  
  if (name.includes('tomato') || name.includes('onion') || name.includes('pepper') ||
      name.includes('carrot') || name.includes('lettuce') || name.includes('spinach')) {
    return 'vegetables'
  }
  
  if (name.includes('apple') || name.includes('banana') || name.includes('berry') ||
      name.includes('orange') || name.includes('lemon') || name.includes('lime')) {
    return 'fruits'
  }
  
  if (name.includes('bread') || name.includes('pasta') || name.includes('rice') ||
      name.includes('flour') || name.includes('cereal') || name.includes('grain')) {
    return 'grains'
  }
  
  if (name.includes('oil') || name.includes('vinegar') || name.includes('sauce') ||
      name.includes('dressing') || name.includes('condiment')) {
    return 'oils'
  }
  
  if (name.includes('salt') || name.includes('pepper') || name.includes('spice') ||
      name.includes('herb') || name.includes('garlic') || name.includes('ginger')) {
    return 'spices'
  }
  
  return 'pantry'
}

export function getRecommendedRestockAmount(item: SimplePantryItem): number {
  // Simple restock recommendations based on unit type
  switch (item.unit) {
    case 'items':
    case 'cans':
    case 'bottles':
      return 4
    case 'lbs':
      return 2
    case 'cups':
      return 3
    default:
      return Math.max(2, Math.ceil(item.current_amount * 2))
  }
}

// Date utilities
export function getWeekOf(date: Date = new Date()): string {
  const monday = new Date(date)
  monday.setDate(date.getDate() - (date.getDay() + 6) % 7) // Get Monday of this week
  return monday.toISOString().split('T')[0]
}

export function formatWeekRange(weekOf: string): string {
  const startDate = new Date(weekOf)
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  const start = startDate.toLocaleDateString('en-US', options)
  const end = endDate.toLocaleDateString('en-US', options)
  
  return `${start} - ${end}`
}

// Claude Code integration utilities
export function generateClaudeContext(
  pantry: SimplePantryInventory,
  recipes: SimpleRecipe[],
  currentPlan: WeeklyPlan
): ClaudeContext {
  const availableIngredients: Record<string, {amount: number, unit: string}> = {}
  const categories: Record<string, string[]> = {}
  const lowStockItems: string[] = []
  
  // Process pantry items
  for (const category of pantry.categories) {
    categories[category.name] = []
    
    for (const item of category.items) {
      availableIngredients[item.name] = {
        amount: item.current_amount,
        unit: item.unit
      }
      
      categories[category.name].push(item.name)
      
      if (isLowStock(item)) {
        lowStockItems.push(item.name)
      }
    }
  }
  
  return {
    pantry_summary: {
      available_ingredients: availableIngredients,
      categories,
      low_stock_items: lowStockItems
    },
    recent_recipes: recipes.slice(-10), // Last 10 recipes
    current_meal_plan: currentPlan,
    dietary_preferences: [], // Could be enhanced with user preferences
    household_size: 2 // Simon & Léa
  }
}

export function exportClaudePrompt(context: ClaudeContext): string {
  const { pantry_summary, current_meal_plan } = context
  
  let prompt = `Current Pantry Inventory:\n`
  
  for (const [category, items] of Object.entries(pantry_summary.categories)) {
    if (items.length > 0) {
      prompt += `\n${category}:\n`
      for (const item of items) {
        const ingredient = pantry_summary.available_ingredients[item]
        prompt += `- ${item}: ${ingredient.amount} ${ingredient.unit}\n`
      }
    }
  }
  
  if (pantry_summary.low_stock_items.length > 0) {
    prompt += `\nLow Stock Items: ${pantry_summary.low_stock_items.join(', ')}\n`
  }
  
  prompt += `\nHousehold: ${context.household_size} people\n`
  prompt += `Current Week: ${formatWeekRange(current_meal_plan.week_of)}\n`
  
  if (current_meal_plan.meals.length > 0) {
    prompt += `\nPlanned Meals:\n`
    for (const meal of current_meal_plan.meals) {
      prompt += `- ${meal.day} ${meal.meal_type}: ${meal.recipe_title}\n`
    }
  }
  
  return prompt
}