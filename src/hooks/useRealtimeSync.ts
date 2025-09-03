import { useEffect, useRef } from 'react'

export interface SyncOptions {
  interval?: number // Polling interval in ms (default: 5000)
  enableBroadcast?: boolean // Use BroadcastChannel API (default: true)
  enableStorage?: boolean // Use storage events (default: true)
}

export function useRealtimeSync<T>(
  key: string,
  _data: T,
  onUpdate: (newData: T) => void,
  options: SyncOptions = {}
) {
  const {
    interval = 5000,
    enableBroadcast = true,
    enableStorage = true
  } = options

  const lastUpdateRef = useRef<number>(Date.now())
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null)

  // Initialize BroadcastChannel for same-origin cross-tab communication
  useEffect(() => {
    if (!enableBroadcast) return

    try {
      const channel = new BroadcastChannel(`sync-${key}`)
      broadcastChannelRef.current = channel

      channel.addEventListener('message', (event) => {
        if (event.data.type === 'UPDATE' && event.data.timestamp > lastUpdateRef.current) {
          onUpdate(event.data.payload)
          lastUpdateRef.current = event.data.timestamp
        }
      })

      return () => {
        channel.close()
        broadcastChannelRef.current = null
      }
    } catch (error) {
      console.warn('BroadcastChannel not supported:', error)
    }
  }, [key, onUpdate, enableBroadcast])

  // Listen for storage events (cross-tab when data changes in localStorage)
  useEffect(() => {
    if (!enableStorage) return

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const newData = JSON.parse(event.newValue)
          // Check if this is a genuine external update
          const dataTimestamp = newData.last_updated ? new Date(newData.last_updated).getTime() : Date.now()
          
          if (dataTimestamp > lastUpdateRef.current) {
            onUpdate(newData)
            lastUpdateRef.current = dataTimestamp
          }
        } catch (error) {
          console.error('Failed to parse synced data:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, onUpdate, enableStorage])

  // Periodic check for updates (fallback mechanism)
  useEffect(() => {
    const checkForUpdates = () => {
      try {
        const stored = localStorage.getItem(key)
        if (stored) {
          const parsedData = JSON.parse(stored)
          const dataTimestamp = parsedData.last_updated ? new Date(parsedData.last_updated).getTime() : Date.now()
          
          if (dataTimestamp > lastUpdateRef.current) {
            onUpdate(parsedData)
            lastUpdateRef.current = dataTimestamp
          }
        }
      } catch (error) {
        console.error('Failed to check for updates:', error)
      }
    }

    const intervalId = setInterval(checkForUpdates, interval)
    return () => clearInterval(intervalId)
  }, [key, onUpdate, interval])

  // Function to broadcast updates to other tabs/windows
  const broadcastUpdate = (newData: T) => {
    const timestamp = Date.now()
    lastUpdateRef.current = timestamp

    // Broadcast via BroadcastChannel
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'UPDATE',
        payload: newData,
        timestamp
      })
    }

    // Update localStorage (will trigger storage events in other tabs)
    try {
      localStorage.setItem(key, JSON.stringify(newData))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  return { broadcastUpdate }
}

// Hook specifically for pantry synchronization
export function usePantrySync(
  pantry: any,
  setPantry: (pantry: any) => void
) {
  return useRealtimeSync(
    'simple-pantry',
    pantry,
    setPantry,
    {
      interval: 3000, // Check every 3 seconds for pantry updates
      enableBroadcast: true,
      enableStorage: true
    }
  )
}

// Hook for shopping list synchronization
export function useShoppingListSync(
  currentPlan: any,
  shoppingList: any,
  setShoppingList: (list: any) => void
) {
  const key = currentPlan ? `shopping-list-${currentPlan.week_of}` : 'shopping-list'
  
  return useRealtimeSync(
    key,
    shoppingList,
    setShoppingList,
    {
      interval: 2000, // Check every 2 seconds for shopping list updates
      enableBroadcast: true,
      enableStorage: true
    }
  )
}