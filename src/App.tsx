import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Calendar, BookOpen, Package } from "lucide-react"
import type { AppView } from "@/types/simple"
import { SimplePantryView } from "@/components/SimplePantryView"
import { SimpleRecipeView } from "@/components/SimpleRecipeView"
import { WeeklyPlanView } from "@/components/WeeklyPlanView"
import { ShoppingListView } from "@/components/ShoppingListView"
import './App.css'

function App() {
  const [activeView, setActiveView] = useState<AppView>('pantry')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simple app initialization
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🍋</div>
          <h1 className="text-2xl font-bold">Loading LemonRecipes...</h1>
          <p className="text-muted-foreground">Smart Pantry & Meal Planning</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b p-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            🍋 LemonRecipes
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Smart Pantry & Meal Planning
          </p>
        </div>
      </header>
      
      <main className="container mx-auto py-6 space-y-6">
        {/* Simple Navigation */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <Button 
            variant={activeView === 'pantry' ? 'default' : 'outline'} 
            className="gap-2"
            onClick={() => setActiveView('pantry')}
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Pantry</span>
            <span className="sm:hidden">Stock</span>
          </Button>
          <Button 
            variant={activeView === 'recipes' ? 'lemon' : 'outline'} 
            className="gap-2"
            onClick={() => setActiveView('recipes')}
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Recipes</span>
            <span className="sm:hidden">Cook</span>
          </Button>
          <Button 
            variant={activeView === 'this-week' ? 'secondary' : 'outline'} 
            className="gap-2"
            onClick={() => setActiveView('this-week')}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">This Week</span>
            <span className="sm:hidden">Plan</span>
          </Button>
          <Button 
            variant={activeView === 'shopping' ? 'secondary' : 'outline'} 
            className="gap-2"
            onClick={() => setActiveView('shopping')}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Shopping</span>
            <span className="sm:hidden">Buy</span>
          </Button>
        </div>

        {/* Content Views */}
        {activeView === 'pantry' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pantry Inventory</h2>
            <SimplePantryView />
          </div>
        )}

        {activeView === 'recipes' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recipe Collection</h2>
            <SimpleRecipeView />
          </div>
        )}

        {activeView === 'this-week' && (
          <div className="space-y-4">
            <WeeklyPlanView />
          </div>
        )}

        {activeView === 'shopping' && (
          <div className="space-y-4">
            <ShoppingListView />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
