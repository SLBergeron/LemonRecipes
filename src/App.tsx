import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Calendar, Users, Clock } from "lucide-react"
import { MealCard } from "@/components/meal-plan/MealCard"
import { BatchSauceCard } from "@/components/meal-plan/BatchSauceCard"
import { GroceryList } from "@/components/grocery/GroceryList"
import { getCurrentMealPlan, formatCurrency, getBudgetProgress } from "@/lib/data"
import './App.css'

function App() {
  const [activeView, setActiveView] = useState<'meal-plan' | 'grocery-list' | 'timeline'>('meal-plan')
  const mealPlan = getCurrentMealPlan()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b p-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            🍋 LemonRecipes
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Smart Meal Planning for Busy Couples
          </p>
        </div>
      </header>
      
      <main className="container mx-auto py-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">
            {mealPlan.title}
          </h2>
          
          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <Button 
              variant={activeView === 'meal-plan' ? 'default' : 'outline'} 
              className="gap-2"
              onClick={() => setActiveView('meal-plan')}
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Meal Plan</span>
              <span className="sm:hidden">Plan</span>
            </Button>
            <Button 
              variant={activeView === 'grocery-list' ? 'lemon' : 'outline'} 
              className="gap-2"
              onClick={() => setActiveView('grocery-list')}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Grocery List</span>
              <span className="sm:hidden">List</span>
            </Button>
            <Button 
              variant={activeView === 'timeline' ? 'secondary' : 'outline'} 
              className="gap-2"
              onClick={() => setActiveView('timeline')}
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
              <span className="sm:hidden">Time</span>
            </Button>
            <Button variant="ghost" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>

        {/* Strategy Cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mealPlan.strategy.map((strategy, index) => (
            <div 
              key={index}
              className="border rounded-lg p-4 sm:p-6 space-y-3"
              style={{ borderLeftColor: strategy.color, borderLeftWidth: '4px' }}
            >
              <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                <span>{strategy.emoji}</span>
                {strategy.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {strategy.description}
              </p>
            </div>
          ))}
        </div>

        {/* Budget Summary */}
        <div className="text-center space-y-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-6 rounded-lg">
          <p className="text-lg font-medium">
            Budget Estimate: {formatCurrency(mealPlan.estimated_cost)}
          </p>
          <p className="text-sm text-muted-foreground">
            Well within your {formatCurrency(mealPlan.budget_target)} target range!
          </p>
          <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-2 max-w-md mx-auto">
            <div 
              className="bg-lemon h-2 rounded-full transition-all duration-500" 
              style={{ width: `${getBudgetProgress(mealPlan)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {getBudgetProgress(mealPlan)}% of maximum budget used
          </p>
        </div>

        {/* Content Views */}
        {activeView === 'meal-plan' && (
          <div className="space-y-8">
            {/* Batch Sauces */}
            <section>
              <h3 className="text-xl font-semibold mb-4">🥣 Batch Sauces — Make Sunday (30 min total)</h3>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mealPlan.batch_sauces.map(sauce => (
                  <BatchSauceCard key={sauce.id} recipe={sauce} />
                ))}
              </div>
            </section>

            {/* 7-Day Meal Plan */}
            <section>
              <h3 className="text-xl font-semibold mb-4">📅 7-Day Meal Plan</h3>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {mealPlan.meals.map(meal => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeView === 'grocery-list' && (
          <GroceryList categories={mealPlan.grocery_categories} />
        )}

        {activeView === 'timeline' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">⏰ Meal Prep Timeline</h3>
            <div className="space-y-4">
              {mealPlan.timeline.map(item => (
                <div key={item.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <h4 className="font-semibold">{item.time}</h4>
                      <p className="text-sm text-muted-foreground">{item.duration}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {item.tasks.map(task => (
                      <label key={task.id} className="flex items-center gap-3 p-2 rounded hover:bg-accent cursor-pointer">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-sm">{task.description}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
