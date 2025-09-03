import { useState, useEffect, useCallback } from 'react'
import type { 
  SimplePantryInventory, 
  SimplePantryItem,
  PantryCategory
} from '@/types/simple'
import { DEFAULT_CATEGORIES } from '@/types/simple'
import { 
  createPantryItem, 
  updatePantryItemAmount,
  isLowStock,
  getCurrentUser
} from '@/lib/simple-utils'
import { initialPantryData } from '@/data/initial-pantry'
import { usePantrySync } from './useRealtimeSync'

// Hook for managing simplified pantry inventory
export function useSimplePantry() {
  const [pantry, setPantry] = useState<SimplePantryInventory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Enable real-time synchronization
  const { broadcastUpdate } = usePantrySync(pantry, setPantry)

  // Initialize pantry with default structure and initial data
  const initializePantry = useCallback((): SimplePantryInventory => {
    // Group initial items by category
    const categorizedItems = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      items: initialPantryData.filter(item => item.category === cat.id)
    }))

    return {
      last_updated: new Date().toISOString(),
      categories: categorizedItems
    }
  }, [])

  // Load pantry data on mount
  useEffect(() => {
    const loadPantryData = async () => {
      try {
        setLoading(true)
        
        // Try localStorage first (for local changes)
        const localData = localStorage.getItem('simple-pantry')
        if (localData) {
          const parsed: SimplePantryInventory = JSON.parse(localData)
          setPantry(parsed)
          setLoading(false)
          return
        }

        // Try to load existing pantry data and convert it
        try {
          const response = await fetch('./data/pantry-inventory.json')
          if (response.ok) {
            const existingData = await response.json()
            const convertedPantry = convertExistingPantryData(existingData)
            setPantry(convertedPantry)
            savePantryToStorage(convertedPantry)
          } else {
            throw new Error('No existing data')
          }
        } catch {
          // Initialize with empty pantry if no existing data
          const newPantry = initializePantry()
          setPantry(newPantry)
          savePantryToStorage(newPantry)
        }
      } catch (err) {
        console.error('Failed to load pantry data:', err)
        setError('Failed to load pantry data')
        // Fall back to empty pantry
        const newPantry = initializePantry()
        setPantry(newPantry)
      } finally {
        setLoading(false)
      }
    }

    loadPantryData()
  }, [initializePantry])

  // Save pantry to localStorage and broadcast to other tabs
  const savePantryToStorage = useCallback((pantryData: SimplePantryInventory) => {
    try {
      const updatedData = {
        ...pantryData,
        last_updated: new Date().toISOString()
      }
      broadcastUpdate(updatedData)
    } catch (err) {
      console.error('Failed to save pantry to localStorage:', err)
    }
  }, [broadcastUpdate])

  // Add new item to pantry
  const addItem = useCallback((name: string, amount: number, unit: string, categoryId: string) => {
    if (!pantry) return

    const newItem = createPantryItem(name, amount, unit, categoryId)
    const updatedPantry: SimplePantryInventory = {
      ...pantry,
      last_updated: new Date().toISOString(),
      categories: pantry.categories.map(category => 
        category.id === categoryId
          ? { ...category, items: [...category.items, newItem] }
          : category
      )
    }

    setPantry(updatedPantry)
    savePantryToStorage(updatedPantry)
  }, [pantry, savePantryToStorage])

  // Update item quantity
  const updateItemAmount = useCallback((itemId: string, newAmount: number) => {
    if (!pantry) return

    const updatedPantry: SimplePantryInventory = {
      ...pantry,
      last_updated: new Date().toISOString(),
      categories: pantry.categories.map(category => ({
        ...category,
        items: category.items.map(item =>
          item.id === itemId
            ? updatePantryItemAmount(item, newAmount)
            : item
        )
      }))
    }

    setPantry(updatedPantry)
    savePantryToStorage(updatedPantry)
  }, [pantry, savePantryToStorage])

  // Update item unit
  const updateItemUnit = useCallback((itemId: string, newUnit: string) => {
    if (!pantry) return

    const updatedPantry: SimplePantryInventory = {
      ...pantry,
      last_updated: new Date().toISOString(),
      categories: pantry.categories.map(category => ({
        ...category,
        items: category.items.map(item =>
          item.id === itemId
            ? { ...item, unit: newUnit, updated_at: new Date().toISOString() }
            : item
        )
      }))
    }

    setPantry(updatedPantry)
    savePantryToStorage(updatedPantry)
  }, [pantry, savePantryToStorage])

  // Update item restock level
  const updateItemRestockLevel = useCallback((itemId: string, newLevel: number) => {
    if (!pantry) return

    const updatedPantry: SimplePantryInventory = {
      ...pantry,
      last_updated: new Date().toISOString(),
      categories: pantry.categories.map(category => ({
        ...category,
        items: category.items.map(item =>
          item.id === itemId
            ? { ...item, normal_restock_level: newLevel, updated_at: new Date().toISOString() }
            : item
        )
      }))
    }

    setPantry(updatedPantry)
    savePantryToStorage(updatedPantry)
  }, [pantry, savePantryToStorage])

  // Update item auto shopping setting
  const updateItemAutoShopping = useCallback((itemId: string, autoShopping: boolean) => {
    if (!pantry) return

    const updatedPantry: SimplePantryInventory = {
      ...pantry,
      last_updated: new Date().toISOString(),
      categories: pantry.categories.map(category => ({
        ...category,
        items: category.items.map(item =>
          item.id === itemId
            ? { ...item, auto_add_to_shopping: autoShopping, updated_at: new Date().toISOString() }
            : item
        )
      }))
    }

    setPantry(updatedPantry)
    savePantryToStorage(updatedPantry)
  }, [pantry, savePantryToStorage])

  // Delete item from pantry
  const deleteItem = useCallback((itemId: string) => {
    if (!pantry) return

    const updatedPantry: SimplePantryInventory = {
      ...pantry,
      last_updated: new Date().toISOString(),
      categories: pantry.categories.map(category => ({
        ...category,
        items: category.items.filter(item => item.id !== itemId)
      }))
    }

    setPantry(updatedPantry)
    savePantryToStorage(updatedPantry)
  }, [pantry, savePantryToStorage])

  // Get items by category
  const getItemsByCategory = useCallback((categoryId?: string): SimplePantryItem[] => {
    if (!pantry) return []
    
    if (!categoryId) {
      return pantry.categories.flatMap(cat => cat.items)
    }
    
    const category = pantry.categories.find(cat => cat.id === categoryId)
    return category?.items || []
  }, [pantry])

  // Get low stock items
  const getLowStockItems = useCallback((): SimplePantryItem[] => {
    if (!pantry) return []
    
    return pantry.categories
      .flatMap(cat => cat.items)
      .filter(item => isLowStock(item))
  }, [pantry])

  // Get pantry statistics
  const getStats = useCallback(() => {
    if (!pantry) return { totalItems: 0, lowStockCount: 0, categories: 0 }
    
    const allItems = pantry.categories.flatMap(cat => cat.items)
    return {
      totalItems: allItems.length,
      lowStockCount: allItems.filter(item => isLowStock(item)).length,
      categories: pantry.categories.filter(cat => cat.items.length > 0).length
    }
  }, [pantry])

  // Convert existing pantry data to new format
  const convertExistingPantryData = (existingData: any): SimplePantryInventory => {
    const newCategories: PantryCategory[] = DEFAULT_CATEGORIES.map(defaultCat => ({
      ...defaultCat,
      items: []
    }))

    // Convert existing items to new format
    if (existingData.categories) {
      for (const existingCat of existingData.categories) {
        if (existingCat.items) {
          for (const existingItem of existingCat.items) {
            // Find matching category or default to 'pantry'
            let targetCategoryId = 'pantry'
            
            // Map old categories to new ones
            if (existingCat.id === 'oils-vinegars' || existingCat.id === 'sauces-condiments') {
              targetCategoryId = 'oils'
            } else if (existingCat.id === 'spices-dried') {
              targetCategoryId = 'spices'
            } else if (existingCat.id === 'proteins-meat' || existingCat.id === 'proteins-seafood') {
              targetCategoryId = 'proteins'
            }

            const targetCategory = newCategories.find(cat => cat.id === targetCategoryId)
            if (targetCategory) {
              // Parse amount from existing format
              let amount = 0
              let unit = 'items'
              
              if (typeof existingItem.current_amount === 'string') {
                if (existingItem.current_amount.includes('%')) {
                  amount = parseInt(existingItem.current_amount.replace('%', '')) || 0
                  unit = '%'
                } else {
                  const match = existingItem.current_amount.match(/(\d+(?:\.\d+)?)\s*(\w+)?/)
                  if (match) {
                    amount = parseFloat(match[1])
                    unit = match[2] || existingItem.unit || 'items'
                  }
                }
              }

              const newItem: SimplePantryItem = {
                id: existingItem.id || `converted-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                name: existingItem.name,
                current_amount: amount,
                unit: unit,
                category: targetCategoryId,
                added_by: getCurrentUser(),
                updated_at: new Date().toISOString()
              }

              targetCategory.items.push(newItem)
            }
          }
        }
      }
    }

    return {
      last_updated: new Date().toISOString(),
      categories: newCategories
    }
  }

  // Update entire pantry (for meal completion deductions)
  const updatePantry = useCallback((updatedPantry: SimplePantryInventory) => {
    setPantry(updatedPantry)
    savePantryToStorage(updatedPantry)
  }, [savePantryToStorage])

  return {
    pantry,
    loading,
    error,
    addItem,
    updateItemAmount,
    updateItemUnit,
    updateItemRestockLevel,
    updateItemAutoShopping,
    deleteItem,
    updatePantry,
    getItemsByCategory,
    getLowStockItems,
    getStats
  }
}