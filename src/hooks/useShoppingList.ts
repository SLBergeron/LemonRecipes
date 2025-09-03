import { useState, useEffect, useCallback } from 'react'
import type { 
  ShoppingItem, 
  ShoppingList, 
  WeeklyPlan, 
  SimpleRecipe, 
  SimplePantryInventory 
} from '@/types/simple'
import { generateShoppingListFromPlan } from '@/lib/simple-utils'

export function useShoppingList(
  currentPlan: WeeklyPlan | null,
  recipes: SimpleRecipe[],
  pantry: SimplePantryInventory | null
) {
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate shopping list when plan, recipes, or pantry changes
  useEffect(() => {
    if (!currentPlan || !pantry || recipes.length === 0) {
      setShoppingList(null)
      return
    }

    const generateList = () => {
      try {
        setLoading(true)
        
        const items = generateShoppingListFromPlan(currentPlan, recipes, pantry)
        
        const newList: ShoppingList = {
          id: `shopping-${currentPlan.id}`,
          week_plan_id: currentPlan.id,
          items,
          generated_at: new Date().toISOString(),
          completed_items: 0,
          total_items: items.length
        }
        
        // Try to load existing checked items from localStorage
        const existingData = localStorage.getItem(`shopping-list-${currentPlan.week_of}`)
        if (existingData) {
          const existing: ShoppingList = JSON.parse(existingData)
          
          // Merge checked status from existing list
          newList.items = newList.items.map(item => {
            const existingItem = existing.items.find(ei => 
              ei.name.toLowerCase() === item.name.toLowerCase() && 
              ei.unit === item.unit
            )
            
            if (existingItem && existingItem.checked) {
              return {
                ...item,
                checked: true,
                checked_by: existingItem.checked_by as 'simon' | 'lea',
                checked_at: existingItem.checked_at
              }
            }
            
            return item
          })
          
          newList.completed_items = newList.items.filter(item => item.checked).length
        }
        
        setShoppingList(newList)
        saveShoppingList(newList)
        
      } catch (err) {
        console.error('Failed to generate shopping list:', err)
        setError('Failed to generate shopping list')
      } finally {
        setLoading(false)
      }
    }

    generateList()
  }, [currentPlan, recipes, pantry])

  // Save shopping list to localStorage
  const saveShoppingList = useCallback((list: ShoppingList) => {
    if (!currentPlan) return
    
    try {
      localStorage.setItem(`shopping-list-${currentPlan.week_of}`, JSON.stringify(list))
    } catch (err) {
      console.error('Failed to save shopping list:', err)
    }
  }, [currentPlan])

  // Toggle item checked status
  const toggleItemChecked = useCallback(async (itemId: string) => {
    if (!shoppingList) return

    const updatedItems = shoppingList.items.map(item => {
      if (item.id === itemId) {
        const isNowChecked = !item.checked
        return {
          ...item,
          checked: isNowChecked,
          checked_by: isNowChecked ? ('simon' as const) : undefined,
          checked_at: isNowChecked ? new Date().toISOString() : undefined
        }
      }
      return item
    })

    const updatedList: ShoppingList = {
      ...shoppingList,
      items: updatedItems,
      completed_items: updatedItems.filter(item => item.checked).length
    }

    setShoppingList(updatedList)
    saveShoppingList(updatedList)

    // Update pantry if item was checked and has pantry_item_id
    const toggledItem = updatedItems.find(item => item.id === itemId)
    if (toggledItem?.checked && toggledItem.pantry_item_id) {
      // This would require pantry update logic
      // For now, we'll handle this manually in the UI
    }
  }, [shoppingList, saveShoppingList])

  // Add custom item to shopping list
  const addCustomItem = useCallback(async (
    name: string,
    amount: number,
    unit: string,
    category: string
  ) => {
    if (!shoppingList) return

    const newItem: ShoppingItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim(),
      amount,
      unit,
      category,
      checked: false,
      needed_for: ['Custom Addition']
    }

    const updatedList: ShoppingList = {
      ...shoppingList,
      items: [...shoppingList.items, newItem],
      total_items: shoppingList.total_items + 1
    }

    setShoppingList(updatedList)
    saveShoppingList(updatedList)
  }, [shoppingList, saveShoppingList])

  // Remove item from shopping list
  const removeItem = useCallback(async (itemId: string) => {
    if (!shoppingList) return

    const updatedItems = shoppingList.items.filter(item => item.id !== itemId)
    const removedItem = shoppingList.items.find(item => item.id === itemId)
    
    const updatedList: ShoppingList = {
      ...shoppingList,
      items: updatedItems,
      completed_items: removedItem?.checked 
        ? shoppingList.completed_items - 1 
        : shoppingList.completed_items,
      total_items: shoppingList.total_items - 1
    }

    setShoppingList(updatedList)
    saveShoppingList(updatedList)
  }, [shoppingList, saveShoppingList])

  // Get items by category
  const getItemsByCategory = useCallback((category?: string): ShoppingItem[] => {
    if (!shoppingList) return []
    
    if (!category) return shoppingList.items
    
    return shoppingList.items.filter(item => item.category === category)
  }, [shoppingList])

  // Get unchecked items
  const getUncheckedItems = useCallback((): ShoppingItem[] => {
    if (!shoppingList) return []
    return shoppingList.items.filter(item => !item.checked)
  }, [shoppingList])

  // Get checked items
  const getCheckedItems = useCallback((): ShoppingItem[] => {
    if (!shoppingList) return []
    return shoppingList.items.filter(item => item.checked)
  }, [shoppingList])

  // Get shopping list statistics
  const getStats = useCallback(() => {
    if (!shoppingList) return { totalItems: 0, checkedItems: 0, categories: 0, progress: 0 }

    const categories = new Set(shoppingList.items.map(item => item.category)).size
    const progress = shoppingList.total_items > 0 
      ? Math.round((shoppingList.completed_items / shoppingList.total_items) * 100)
      : 0

    return {
      totalItems: shoppingList.total_items,
      checkedItems: shoppingList.completed_items,
      categories,
      progress
    }
  }, [shoppingList])

  // Clear all checked items
  const clearCheckedItems = useCallback(async () => {
    if (!shoppingList) return

    const updatedItems = shoppingList.items.filter(item => !item.checked)
    
    const updatedList: ShoppingList = {
      ...shoppingList,
      items: updatedItems,
      completed_items: 0,
      total_items: updatedItems.length
    }

    setShoppingList(updatedList)
    saveShoppingList(updatedList)
  }, [shoppingList, saveShoppingList])

  return {
    shoppingList,
    loading,
    error,
    toggleItemChecked,
    addCustomItem,
    removeItem,
    getItemsByCategory,
    getUncheckedItems,
    getCheckedItems,
    getStats,
    clearCheckedItems
  }
}