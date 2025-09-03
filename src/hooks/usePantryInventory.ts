import { useState, useEffect } from 'react'
import type { PantryInventory } from '@/types/pantry'

export function usePantryInventory() {
  const [pantry, setPantry] = useState<PantryInventory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPantryData = async () => {
      try {
        const response = await fetch('./api/pantry-inventory.json')
        if (!response.ok) {
          throw new Error(`Failed to load pantry data: ${response.status}`)
        }
        const data = await response.json()
        setPantry(data as PantryInventory)
        setLoading(false)
      } catch (err) {
        console.error('Error loading pantry data:', err)
        setError('Failed to load pantry inventory')
        // Set minimal fallback data
        setPantry({
          last_updated: new Date().toISOString().split('T')[0],
          categories: [
            {
              id: 'loading',
              title: 'Loading...',
              emoji: '🍋',
              color: '#FBD38D',
              items: [
                {
                  id: 'loading-item',
                  name: 'Loading pantry data...',
                  current_amount: '0%',
                  unit: '%',
                  total_capacity: '100%',
                  expires: '2025-12-31',
                  price_per_unit: 0
                }
              ]
            }
          ]
        } as PantryInventory)
        setLoading(false)
      }
    }

    loadPantryData()
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