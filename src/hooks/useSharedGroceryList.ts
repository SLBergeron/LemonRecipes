import { useState, useEffect } from 'react'

const STORAGE_KEY = 'shared-grocery-checklist'

export function useSharedGroceryList() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setCheckedItems(parsed.items || {})
        setLastSync(parsed.lastSync ? new Date(parsed.lastSync) : null)
      } catch (error) {
        console.warn('Failed to parse stored grocery list:', error)
      }
    }
  }, [])

  // Save to localStorage whenever checkedItems changes
  useEffect(() => {
    const data = {
      items: checkedItems,
      lastSync: new Date().toISOString(),
      deviceId: getDeviceId()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setLastSync(new Date())
  }, [checkedItems])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Sync with server periodically when online
  useEffect(() => {
    if (!isOnline) return

    const interval = setInterval(async () => {
      await syncWithServer()
    }, 30000) // Sync every 30 seconds when online

    return () => clearInterval(interval)
  }, [isOnline, checkedItems])

  function getDeviceId(): string {
    let deviceId = localStorage.getItem('device-id')
    if (!deviceId) {
      deviceId = `device-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`
      localStorage.setItem('device-id', deviceId)
    }
    return deviceId
  }

  async function syncWithServer() {
    if (!isOnline) return

    try {
      // In a real implementation, this would sync with your backend
      // For now, we'll simulate using a shared JSON endpoint via GitHub
      const response = await fetch('/api/grocery-checklist.json')
      if (response.ok) {
        const serverData = await response.json()
        // Merge server state with local state (server wins for conflicts)
        setCheckedItems(prev => ({ ...prev, ...serverData.items }))
      }
    } catch (error) {
      console.warn('Failed to sync with server:', error)
    }
  }

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const uncheckAll = () => {
    setCheckedItems({})
  }

  const checkAll = (itemIds: string[]) => {
    const newChecked = { ...checkedItems }
    itemIds.forEach(id => {
      newChecked[id] = true
    })
    setCheckedItems(newChecked)
  }

  const getProgress = (totalItems: number) => {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length
    return totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0
  }

  return {
    checkedItems,
    toggleItem,
    uncheckAll,
    checkAll,
    getProgress,
    lastSync,
    isOnline,
    syncWithServer: () => syncWithServer()
  }
}