import { useState, useEffect } from 'react'
import type { PantryInventory } from '@/types/pantry'
import pantryData from '@/data/pantry-inventory.json'

export function usePantryInventory() {
  const [pantry, setPantry] = useState<PantryInventory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setPantry(pantryData as PantryInventory)
      setLoading(false)
    } catch (err) {
      setError('Failed to load pantry inventory')
      setLoading(false)
    }
  }, [])

  const updateItemAmount = (itemId: string, newAmount: string) => {
    if (!pantry) return

    const updatedPantry = {
      ...pantry,
      last_updated: new Date().toISOString().split('T')[0],
      categories: pantry.categories.map(category => ({
        ...category,
        items: category.items.map(item => 
          item.id === itemId 
            ? { ...item, current_amount: newAmount }
            : item
        )
      }))
    }
    
    setPantry(updatedPantry)
    
    // In a real app, you'd sync this to your backend or localStorage
    localStorage.setItem('pantry-inventory', JSON.stringify(updatedPantry))
  }

  const getAvailableAmount = (itemId: string): string | null => {
    if (!pantry) return null
    
    for (const category of pantry.categories) {
      const item = category.items.find(item => item.id === itemId)
      if (item) return item.current_amount
    }
    
    return null
  }

  const isItemAvailable = (itemId: string, requiredAmount?: string): boolean => {
    const available = getAvailableAmount(itemId)
    if (!available) return false
    
    if (!requiredAmount) return true
    
    // Simple availability check - in practice you'd need more sophisticated unit conversion
    return true
  }

  return {
    pantry,
    loading,
    error,
    updateItemAmount,
    getAvailableAmount,
    isItemAvailable
  }
}