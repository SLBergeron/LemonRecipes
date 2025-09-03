import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Package } from "lucide-react"
import type { SimplePantryInventory, RecipeIngredient } from '@/types/simple'

interface PantryIngredientPickerProps {
  pantry: SimplePantryInventory | null
  onAddIngredient: (ingredient: RecipeIngredient) => void
  children: React.ReactNode
}

export function PantryIngredientPicker({ pantry, onAddIngredient, children }: PantryIngredientPickerProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedIngredient, setSelectedIngredient] = useState<{
    name: string
    unit: string
    pantry_item_id: string
    available_amount: number
  } | null>(null)
  const [amount, setAmount] = useState(1)
  const [unit, setUnit] = useState('')
  const [isOptional, setIsOptional] = useState(false)

  if (!pantry) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pantry Not Available</DialogTitle>
            <DialogDescription>
              Please load your pantry first to select ingredients from it.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  // Get all pantry items for searching
  const allPantryItems = pantry.categories.flatMap(cat => 
    cat.items.map(item => ({
      ...item,
      category_name: cat.name,
      category_emoji: cat.emoji
    }))
  )

  // Filter items based on search and category
  const filteredItems = allPantryItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
      item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSelectIngredient = (item: typeof allPantryItems[0]) => {
    setSelectedIngredient({
      name: item.name,
      unit: item.unit,
      pantry_item_id: item.id,
      available_amount: item.current_amount
    })
    setUnit(item.unit)
    setAmount(1)
  }

  const handleAddIngredient = () => {
    if (!selectedIngredient) return

    const ingredient: RecipeIngredient = {
      name: selectedIngredient.name,
      amount: amount,
      unit: unit,
      pantry_item_id: selectedIngredient.pantry_item_id,
      optional: isOptional
    }

    onAddIngredient(ingredient)
    
    // Reset form
    setSelectedIngredient(null)
    setAmount(1)
    setUnit('')
    setIsOptional(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Ingredient from Pantry</DialogTitle>
          <DialogDescription>
            Select ingredients from your current pantry inventory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ingredient-search">Search Ingredients</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="ingredient-search"
                  placeholder="Search pantry items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category-filter">Filter by Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {pantry.categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.emoji} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ingredient Selection */}
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No ingredients found</p>
              </div>
            ) : (
              filteredItems.map(item => (
                <Card 
                  key={item.id}
                  className={`cursor-pointer transition-colors ${
                    selectedIngredient?.pantry_item_id === item.id 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelectIngredient(item)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.category_emoji} {item.category_name}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Available: {item.current_amount} {item.unit}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Selected Ingredient Configuration */}
          {selectedIngredient && (
            <Card className="border-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Configure Ingredient</CardTitle>
                <CardDescription>
                  {selectedIngredient.name} • Available: {selectedIngredient.available_amount} {selectedIngredient.unit}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ingredient-amount">Amount Needed</Label>
                    <Input
                      id="ingredient-amount"
                      type="number"
                      min="0"
                      step="0.1"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ingredient-unit">Unit</Label>
                    <Input
                      id="ingredient-unit"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder={selectedIngredient.unit}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="optional-ingredient"
                    checked={isOptional}
                    onChange={(e) => setIsOptional(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="optional-ingredient" className="text-sm">
                    This ingredient is optional
                  </Label>
                </div>

                {/* Availability Warning */}
                {amount > selectedIngredient.available_amount && unit === selectedIngredient.unit && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      ⚠️ You need {amount} {unit} but only have {selectedIngredient.available_amount} {selectedIngredient.unit} available.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleAddIngredient} disabled={amount <= 0 || !unit.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Recipe
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedIngredient(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}