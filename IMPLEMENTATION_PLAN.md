# 🍋 LemonRecipes: Next Phase Implementation Plan

## Phase 1: Enhanced Pantry (✅ COMPLETED)
- ✅ Fixed pantry item display (cards/table)
- ✅ Converted meat quantities to grams for granularity
- ✅ Improved low stock detection logic
- ✅ 80+ items properly categorized and displaying

---

## Phase 2: Recipe System Implementation 🍳

### 2.1 Recipe Data Structure (SimpleRecipeView.tsx)
**Current Status**: Basic UI exists, needs full functionality

**Tasks:**
- [ ] Create sample recipes using existing pantry ingredients
- [ ] Implement recipe creation form with ingredient picker
- [ ] Add pantry availability checking (can make / missing ingredients)
- [ ] Recipe search and filtering
- [ ] Recipe scaling (adjust servings)

**Sample Recipes to Implement:**
```javascript
{
  title: "Ground Beef Stir Fry",
  servings: 4,
  prep_time: 15,
  cook_time: 10,
  ingredients: [
    { name: "Ground Beef", amount: 454, unit: "g", pantry_item_id: "meat-ground-beef" },
    { name: "Frozen Corn", amount: 100, unit: "g", pantry_item_id: "frozen-corn" },
    { name: "Onions", amount: 1, unit: "items", pantry_item_id: "veg-onions" },
    { name: "Garlic", amount: 2, unit: "cloves", pantry_item_id: "veg-garlic" },
    { name: "Cooking Sake", amount: 30, unit: "ml", pantry_item_id: "pantry-sake" }
  ],
  instructions: [
    "Heat oil in large pan over medium-high heat",
    "Add ground beef, cook until browned",
    "Add diced onions and garlic, cook 2 minutes", 
    "Add corn and sake, stir-fry 3-4 minutes",
    "Season with salt and pepper to taste"
  ]
}
```

### 2.2 Pantry Integration
- [ ] Real-time ingredient availability checking
- [ ] Highlight missing ingredients in red
- [ ] Show alternative ingredients from pantry
- [ ] Update pantry quantities when cooking (optional)

### 2.3 Recipe Features
- [ ] Recipe categories/tags
- [ ] Cooking time estimates  
- [ ] Difficulty levels
- [ ] Nutritional information (basic)
- [ ] Recipe ratings/favorites

---

## Phase 3: Weekly Planning System 📅

### 3.1 Weekly Plan Structure (WeeklyPlanView.tsx)
**Current Status**: Basic UI exists, needs full functionality

**Tasks:**
- [ ] 7-day calendar grid (Mon-Sun)
- [ ] Meal types: Breakfast, Lunch, Dinner, Snacks
- [ ] Drag-and-drop recipe assignment
- [ ] Serving size adjustments per meal
- [ ] Weekly plan templates

**UI Layout:**
```
| Day     | Breakfast | Lunch        | Dinner           |
|---------|-----------|--------------|------------------|
| Monday  | [+]       | [+]          | Ground Beef Stir Fry |
| Tuesday | [+]       | Leftover Stir Fry | [+]         |
| ...     | ...       | ...          | ...              |
```

### 3.2 Smart Planning Features
- [ ] Recipe suggestions based on pantry availability
- [ ] Leftover management (plan for leftovers)
- [ ] Batch cooking optimization
- [ ] Nutritional balance across week

---

## Phase 4: Shopping List Generation 🛒

### 4.1 Auto-Generation (ShoppingListView.tsx)
**Current Status**: Basic UI exists, needs functionality

**Tasks:**
- [ ] Generate shopping list from weekly meal plan
- [ ] Subtract existing pantry quantities
- [ ] Group items by store sections (produce, meat, dairy, etc.)
- [ ] Quantity consolidation (multiple recipes needing same ingredient)
- [ ] Smart unit conversions

**Example Logic:**
```javascript
// Recipe 1 needs: 200g ground beef
// Recipe 2 needs: 454g ground beef  
// Pantry has: 2270g ground beef
// Shopping list: No ground beef needed (sufficient in pantry)

// Recipe needs: 2 onions
// Pantry has: 7 onions
// Shopping list: No onions needed
```

### 4.2 Shopping List Features  
- [ ] Checkable items with progress bar
- [ ] Estimated costs (optional)
- [ ] Store-specific lists (if shopping at multiple stores)
- [ ] Mobile-optimized for grocery shopping

---

## Phase 5: Cross-Device Sync 🔄
- [ ] GitHub sync for Simon & Léa access
- [ ] Conflict resolution for simultaneous edits
- [ ] Sync status indicators
- [ ] Offline functionality with sync on reconnect

---

## Implementation Priority

### Week 1: Recipe System Core
1. **Recipe Creation**: Form to create recipes with pantry ingredient picker
2. **Recipe Display**: Cards showing recipes with availability status
3. **Pantry Integration**: Real-time checking of available ingredients

### Week 2: Weekly Planning  
1. **Calendar Grid**: 7-day x meal-type layout
2. **Recipe Assignment**: Add recipes to specific meals
3. **Planning Logic**: Prevent conflicts, handle leftovers

### Week 3: Shopping Lists
1. **Auto-Generation**: Calculate needed ingredients from weekly plan
2. **Pantry Subtraction**: Remove available quantities
3. **Mobile Shopping**: Checkable list optimized for phone use

### Week 4: Polish & Sync
1. **GitHub Sync**: Cross-device functionality
2. **UX Improvements**: Drag-and-drop, better mobile experience  
3. **Testing**: Comprehensive testing with real usage scenarios

---

## Technical Architecture

### Data Flow:
```
Pantry Items ──┐
               ├──→ Recipe Availability Checking
Recipes ───────┤
               ├──→ Weekly Meal Planning
Weekly Plan ───┤
               └──→ Shopping List Generation
```

### Key Functions to Implement:
- `checkRecipeAvailability(recipe, pantry)` → boolean + missing items
- `generateWeeklyPlan(recipes, preferences)` → WeeklyPlan
- `generateShoppingList(weeklyPlan, pantry)` → ShoppingItem[]
- `syncWithGitHub(data)` → void

This plan provides a clear roadmap from the current working pantry system to a full meal planning and shopping solution.