import { useState, useEffect, useCallback } from 'react'
import type { 
  PantryInventory, 
  PantryItem, 
  PantryCategory, 
  PantryChangeLog,
  PantryNotification,
  AddItemFormData,
  AddCategoryFormData
} from '@/types/pantry'
import { 
  createPantryItem,
  createPantryCategory,
  createChangeLog,
  getUserIdentity,
  generateId,
  sortPantryItems
} from '@/lib/pantry-utils'

export function usePantryInventory() {
  const [pantry, setPantry] = useState<PantryInventory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [changeLog, setChangeLog] = useState<PantryChangeLog[]>([])
  const [notifications, setNotifications] = useState<PantryNotification[]>([])

  // Load initial pantry data
  useEffect(() => {
    const loadPantryData = async () => {
      try {
        // Try to load from localStorage first (for local changes)
        const localData = localStorage.getItem('pantry-inventory-local')
        if (localData) {
          const parsed = JSON.parse(localData)
          setPantry(parsed)
          setLoading(false)
          return
        }

        // Fallback to API data
        const response = await fetch('./api/pantry-inventory.json')
        if (!response.ok) {
          throw new Error(`Failed to load pantry data: ${response.status}`)
        }
        const data = await response.json()
        
        // Enhance with required fields for new system
        const enhancedData: PantryInventory = {
          ...data,
          version: data.version || 1,
          sync_metadata: {
            last_sync: new Date().toISOString(),
            pending_changes: 0,
            sync_status: 'synced'
          },
          categories: data.categories.map((category: any) => ({
            ...category,
            custom_category: false,
            created_at: '2025-09-03T00:00:00.000Z',
            updated_at: new Date().toISOString(),
            items: category.items.map((item: any) => ({
              ...item,
              category_id: category.id,
              created_by: 'System',
              created_at: '2025-09-03T00:00:00.000Z',
              updated_at: new Date().toISOString(),
              custom_item: false
            }))
          }))
        }

        setPantry(enhancedData)
        // Save to localStorage for persistence
        localStorage.setItem('pantry-inventory-local', JSON.stringify(enhancedData))
        setLoading(false)
      } catch (err) {
        console.error('Error loading pantry data:', err)
        setError('Failed to load pantry inventory')
        // Set minimal fallback data
        const fallbackData: PantryInventory = {
          last_updated: new Date().toISOString().split('T')[0],
          version: 1,
          sync_metadata: {
            last_sync: new Date().toISOString(),
            pending_changes: 0,
            sync_status: 'error'
          },
          categories: [
            {
              id: 'loading',
              title: 'Loading...',
              emoji: '🍋',
              color: '#FBD38D',
              custom_category: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              items: [
                {
                  id: 'loading-item',
                  name: 'Loading pantry data...',
                  current_amount: '0%',
                  unit: '%',
                  total_capacity: '100%',
                  expires: '2025-12-31',
                  price_per_unit: 0,
                  category_id: 'loading',
                  created_by: 'System',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  custom_item: false
                }
              ]
            }
          ]
        }
        setPantry(fallbackData)
        setLoading(false)
      }
    }

    loadPantryData()
    
    // Load change log from localStorage
    const savedChanges = localStorage.getItem('pantry-changes')
    if (savedChanges) {
      setChangeLog(JSON.parse(savedChanges))
    }
  }, [])

  // Save to localStorage whenever pantry changes
  const savePantryToStorage = useCallback((newPantry: PantryInventory) => {
    localStorage.setItem('pantry-inventory-local', JSON.stringify(newPantry))
  }, [])

  // Save change log to localStorage
  const saveChangeLog = useCallback((changes: PantryChangeLog[]) => {
    localStorage.setItem('pantry-changes', JSON.stringify(changes))
    setChangeLog(changes)
  }, [])

  // Add a new notification
  const addNotification = useCallback((notification: Omit<PantryNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: PantryNotification = {
      ...notification,
      id: generateId(),
      timestamp: new Date().toISOString(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
    
    // Auto-remove non-action notifications after 5 seconds
    if (!notification.action_required) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id))
      }, 5000)
    }
  }, [])

  // Add a new item to the pantry
  const addItem = useCallback(async (formData: AddItemFormData): Promise<PantryItem> => {
    if (!pantry) throw new Error('Pantry not loaded')

    const newItem = createPantryItem(formData, formData.category_id)
    const changeEntry = createChangeLog('add', 'item', newItem.id, undefined, newItem)

    const updatedPantry: PantryInventory = {
      ...pantry,
      last_updated: new Date().toISOString(),
      version: pantry.version + 1,
      sync_metadata: {
        ...pantry.sync_metadata,
        pending_changes: pantry.sync_metadata.pending_changes + 1,
        sync_status: 'syncing'
      },
      categories: pantry.categories.map(category => 
        category.id === formData.category_id 
          ? {
              ...category,
              items: sortPantryItems([...category.items, newItem]),
              updated_at: new Date().toISOString()
            }
          : category
      )
    }

    setPantry(updatedPantry)
    savePantryToStorage(updatedPantry)
    saveChangeLog([...changeLog, changeEntry])

    addNotification({
      type: 'sync_success',
      item: newItem,
      message: `Added ${newItem.name} to pantry`,
      action_required: false
    })

    return newItem
  }, [pantry, changeLog, savePantryToStorage, saveChangeLog, addNotification])

  // Update an existing item
  const updateItem = useCallback(async (itemId: string, updates: Partial<PantryItem>): Promise<PantryItem> => {
    if (!pantry) throw new Error('Pantry not loaded')

    let oldItem: PantryItem | undefined
    let updatedItem: PantryItem | undefined

    const updatedPantry: PantryInventory = {
      ...pantry,
      last_updated: new Date().toISOString(),
      version: pantry.version + 1,
      sync_metadata: {
        ...pantry.sync_metadata,
        pending_changes: pantry.sync_metadata.pending_changes + 1,
        sync_status: 'syncing'
      },
      categories: pantry.categories.map(category => ({
        ...category,
        items: category.items.map(item => {
          if (item.id === itemId) {
            oldItem = item
            updatedItem = {
              ...item,
              ...updates,
              updated_at: new Date().toISOString()
            }
            return updatedItem
          }
          return item
        }),
        updated_at: category.items.some(item => item.id === itemId) 
          ? new Date().toISOString() 
          : category.updated_at
      }))
    }

    if (!updatedItem || !oldItem) {
      throw new Error('Item not found')
    }

    const changeEntry = createChangeLog('update', 'item', itemId, oldItem, updatedItem)

    setPantry(updatedPantry)
    savePantryToStorage(updatedPantry)
    saveChangeLog([...changeLog, changeEntry])

    addNotification({
      type: 'sync_success',
      item: updatedItem,
      message: `Updated ${updatedItem.name}`,
      action_required: false
    })

    return updatedItem
  }, [pantry, changeLog, savePantryToStorage, saveChangeLog, addNotification])

  // Remove an item from the pantry
  const removeItem = useCallback(async (itemId: string): Promise<void> => {
    if (!pantry) throw new Error('Pantry not loaded')

    let removedItem: PantryItem | undefined

    const updatedPantry: PantryInventory = {
      ...pantry,
      last_updated: new Date().toISOString(),
      version: pantry.version + 1,
      sync_metadata: {
        ...pantry.sync_metadata,
        pending_changes: pantry.sync_metadata.pending_changes + 1,
        sync_status: 'syncing'
      },
      categories: pantry.categories.map(category => ({
        ...category,
        items: category.items.filter(item => {
          if (item.id === itemId) {
            removedItem = item
            return false
          }
          return true
        }),
        updated_at: category.items.some(item => item.id === itemId) 
          ? new Date().toISOString() 
          : category.updated_at
      }))
    }

    if (!removedItem) {
      throw new Error('Item not found')
    }

    const changeEntry = createChangeLog('remove', 'item', itemId, removedItem, undefined)

    setPantry(updatedPantry)
    savePantryToStorage(updatedPantry)
    saveChangeLog([...changeLog, changeEntry])

    addNotification({
      type: 'sync_success',
      item: removedItem,
      message: `Removed ${removedItem.name} from pantry`,
      action_required: false
    })
  }, [pantry, changeLog, savePantryToStorage, saveChangeLog, addNotification])

  // Add a new category
  const addCategory = useCallback(async (formData: AddCategoryFormData): Promise<PantryCategory> => {
    if (!pantry) throw new Error('Pantry not loaded')

    const newCategory = createPantryCategory(formData)
    const changeEntry = createChangeLog('add_category', 'category', newCategory.id, undefined, newCategory)

    const updatedPantry: PantryInventory = {
      ...pantry,
      last_updated: new Date().toISOString(),
      version: pantry.version + 1,
      sync_metadata: {
        ...pantry.sync_metadata,
        pending_changes: pantry.sync_metadata.pending_changes + 1,
        sync_status: 'syncing'
      },
      categories: [...pantry.categories, newCategory]
    }

    setPantry(updatedPantry)
    savePantryToStorage(updatedPantry)
    saveChangeLog([...changeLog, changeEntry])

    addNotification({
      type: 'sync_success',
      category: newCategory,
      message: `Added category ${newCategory.title}`,
      action_required: false
    })

    return newCategory
  }, [pantry, changeLog, savePantryToStorage, saveChangeLog, addNotification])

  // Remove a category (only if it's empty)
  const removeCategory = useCallback(async (categoryId: string): Promise<void> => {
    if (!pantry) throw new Error('Pantry not loaded')

    const categoryToRemove = pantry.categories.find(cat => cat.id === categoryId)
    if (!categoryToRemove) {
      throw new Error('Category not found')
    }

    if (categoryToRemove.items.length > 0) {
      throw new Error('Cannot delete category with items. Move items first.')
    }

    if (!categoryToRemove.custom_category) {
      throw new Error('Cannot delete system categories')
    }

    const updatedPantry: PantryInventory = {
      ...pantry,
      last_updated: new Date().toISOString(),
      version: pantry.version + 1,
      sync_metadata: {
        ...pantry.sync_metadata,
        pending_changes: pantry.sync_metadata.pending_changes + 1,
        sync_status: 'syncing'
      },
      categories: pantry.categories.filter(category => category.id !== categoryId)
    }

    const changeEntry = createChangeLog('remove_category', 'category', categoryId, categoryToRemove, undefined)

    setPantry(updatedPantry)
    savePantryToStorage(updatedPantry)
    saveChangeLog([...changeLog, changeEntry])

    addNotification({
      type: 'sync_success',
      category: categoryToRemove,
      message: `Removed category ${categoryToRemove.title}`,
      action_required: false
    })
  }, [pantry, changeLog, savePantryToStorage, saveChangeLog, addNotification])

  // Update an existing category
  const updateCategory = useCallback(async (categoryId: string, updates: Partial<PantryCategory>): Promise<PantryCategory> => {
    if (!pantry) throw new Error('Pantry not loaded')

    let oldCategory: PantryCategory | undefined
    let updatedCategory: PantryCategory | undefined

    const updatedPantry: PantryInventory = {
      ...pantry,
      last_updated: new Date().toISOString(),
      version: pantry.version + 1,
      sync_metadata: {
        ...pantry.sync_metadata,
        pending_changes: pantry.sync_metadata.pending_changes + 1,
        sync_status: 'syncing'
      },
      categories: pantry.categories.map(category => {
        if (category.id === categoryId) {
          oldCategory = category
          updatedCategory = {
            ...category,
            ...updates,
            updated_at: new Date().toISOString()
          }
          return updatedCategory
        }
        return category
      })
    }

    if (!updatedCategory || !oldCategory) {
      throw new Error('Category not found')
    }

    const changeEntry = createChangeLog('update', 'category', categoryId, oldCategory, updatedCategory)

    setPantry(updatedPantry)
    savePantryToStorage(updatedPantry)
    saveChangeLog([...changeLog, changeEntry])

    addNotification({
      type: 'sync_success',
      category: updatedCategory,
      message: `Updated category ${updatedCategory.title}`,
      action_required: false
    })

    return updatedCategory
  }, [pantry, changeLog, savePantryToStorage, saveChangeLog, addNotification])

  // Legacy update method for backward compatibility
  const updateItemAmount = useCallback((itemId: string, newAmount: string) => {
    updateItem(itemId, { current_amount: newAmount })
  }, [updateItem])

  // Check if item is available in pantry
  const isItemAvailable = useCallback((itemId: string, requiredAmount?: string): boolean => {
    if (!pantry) return false
    
    for (const category of pantry.categories) {
      const item = category.items.find(item => item.id === itemId)
      if (item) {
        // Simple availability check - in practice you'd need more sophisticated unit conversion
        return item.current_amount !== '0' && item.current_amount !== '0%'
      }
    }
    
    return false
  }, [pantry])

  // Get item by ID
  const getItem = useCallback((itemId: string): PantryItem | undefined => {
    if (!pantry) return undefined
    
    for (const category of pantry.categories) {
      const item = category.items.find(item => item.id === itemId)
      if (item) return item
    }
    
    return undefined
  }, [pantry])

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  // Clear a specific notification
  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }, [])

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Get available amount for an item (legacy compatibility)
  const getAvailableAmount = useCallback((itemId: string): string | null => {
    const item = getItem(itemId)
    return item ? item.current_amount : null
  }, [getItem])

  return {
    // State
    pantry,
    loading,
    error,
    changeLog,
    notifications,
    
    // CRUD Operations
    addItem,
    updateItem,
    removeItem,
    addCategory,
    updateCategory,
    removeCategory,
    
    // Item queries
    getItem,
    isItemAvailable,
    getAvailableAmount,
    
    // Notifications
    markNotificationAsRead,
    clearNotification,
    clearNotifications,
    
    // Legacy compatibility
    updateItemAmount
  }
}