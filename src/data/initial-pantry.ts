import type { SimplePantryItem } from '@/types/simple'

export const initialPantryData: SimplePantryItem[] = [
  // Meat & Proteins (converted to grams for precision)
  { id: 'meat-ground-beef', name: 'Medium Ground Beef', current_amount: 2270, unit: 'g', category: 'proteins', added_by: 'simon', updated_at: new Date().toISOString() }, // 5 lbs
  { id: 'meat-pork-roast', name: 'Pork Roast', current_amount: 2270, unit: 'g', category: 'proteins', added_by: 'simon', updated_at: new Date().toISOString() }, // 5 lbs
  { id: 'meat-chicken-legs', name: 'Chicken Legs/Thighs', current_amount: 2270, unit: 'g', category: 'proteins', added_by: 'simon', updated_at: new Date().toISOString() }, // 5 lbs
  { id: 'meat-budget-steaks', name: 'Budget Steaks', current_amount: 2270, unit: 'g', category: 'proteins', added_by: 'simon', updated_at: new Date().toISOString() }, // 5 lbs
  { id: 'meat-beef-roast', name: 'Beef Roast', current_amount: 2270, unit: 'g', category: 'proteins', added_by: 'simon', updated_at: new Date().toISOString() }, // 5 lbs
  { id: 'meat-beef-ribs', name: 'Beef Ribs', current_amount: 2270, unit: 'g', category: 'proteins', added_by: 'simon', updated_at: new Date().toISOString() }, // 5 lbs
  { id: 'meat-beef-stew', name: 'Beef Stew/Stir Fry', current_amount: 1362, unit: 'g', category: 'proteins', added_by: 'simon', updated_at: new Date().toISOString() }, // 3 lbs
  { id: 'meat-beef-patties', name: 'All Beef Patties', current_amount: 908, unit: 'g', category: 'proteins', added_by: 'simon', updated_at: new Date().toISOString() }, // 2 lbs
  { id: 'meat-bacon', name: 'Double Smoked Sliced Bacon', current_amount: 375, unit: 'g', category: 'proteins', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'protein-seitan', name: 'Beefless Tenders (Seitan)', current_amount: 350, unit: 'g', category: 'proteins', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'protein-tofu', name: 'Firm Tofu', current_amount: 450, unit: 'g', category: 'proteins', added_by: 'simon', updated_at: new Date().toISOString() },

  // Frozen Items
  { id: 'frozen-cauliflower', name: 'Frozen Cauliflower', current_amount: 500, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'frozen-dumplings', name: 'Pork & Leek Dumplings', current_amount: 500, unit: 'g', category: 'grains', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'frozen-corn', name: 'Frozen Corn', current_amount: 200, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'frozen-edamame', name: 'Frozen Edamame', current_amount: 200, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'frozen-hashbrowns', name: 'Frozen Hashbrowns', current_amount: 1, unit: 'packages', category: 'grains', added_by: 'simon', updated_at: new Date().toISOString() },

  // Vegetables & Fresh
  { id: 'veg-cabbage', name: 'Whole Cabbage', current_amount: 1, unit: 'heads', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'veg-broccoli', name: 'Broccoli', current_amount: 1, unit: 'heads', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'veg-mushrooms', name: 'Crimini Mushrooms', current_amount: 9, unit: 'items', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'veg-roma-tomatoes', name: 'Roma Tomatoes', current_amount: 4, unit: 'items', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'veg-cherry-tomatoes', name: 'Cherry Tomatoes', current_amount: 150, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'veg-carrots', name: 'Carrots', current_amount: 250, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'veg-eggplant', name: 'Eggplant', current_amount: 1, unit: 'items', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'veg-jalapeno', name: 'Jalapeño', current_amount: 1, unit: 'items', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'veg-corn-fresh', name: 'Fresh Corn', current_amount: 6, unit: 'ears', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'veg-onions', name: 'Onions', current_amount: 7, unit: 'items', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'veg-garlic', name: 'Garlic Bulbs', current_amount: 2, unit: 'heads', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString() },

  // Fruits
  { id: 'fruit-peaches', name: 'Peaches', current_amount: 4, unit: 'items', category: 'fruits', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'fruit-kiwis', name: 'Kiwis', current_amount: 3, unit: 'items', category: 'fruits', added_by: 'simon', updated_at: new Date().toISOString() },

  // Dairy & Cheese
  { id: 'dairy-butter', name: 'Butter', current_amount: 500, unit: 'g', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'dairy-milk', name: 'Milk', current_amount: 500, unit: 'ml', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'dairy-goat-cheese', name: 'Pure Goat Cheese', current_amount: 150, unit: 'g', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'dairy-gorgonzola', name: 'Gorgonzola', current_amount: 100, unit: 'g', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString() },

  // Spices & Seasonings
  { id: 'spice-ras-el-hanout', name: 'Ras El Hanout', current_amount: 85, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-tex-mex', name: 'Frontera Tex-Mex Seasoning', current_amount: 120, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-garlic-salt', name: 'Deluxe Garlic Salt', current_amount: 150, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-roasting-blend', name: 'Rustic Roasting Blend', current_amount: 95, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-tarragon-shallot', name: 'Tarragon-Shallot Blend', current_amount: 75, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-marrakesh-salmon', name: 'Marrakesh Salmon Seasoning', current_amount: 110, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-salt', name: 'Salt', current_amount: 800, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-pepper', name: 'Black Pepper', current_amount: 180, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-flour', name: 'All-Purpose Flour', current_amount: 2000, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-garlic-grit', name: 'Garlic Grit', current_amount: 65, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-voodoo-pork', name: 'Voodoo Crutch (Pork)', current_amount: 50, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-voodoo-chicken', name: 'Voodoo Crutch (Chicken)', current_amount: 50, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-mustard-seeds', name: 'Yellow Mustard Seeds', current_amount: 15, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-allspice', name: 'Whole Allspice', current_amount: 8, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-four-prawns', name: 'Four Prawns Four Spices', current_amount: 80, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-sugar', name: 'White Sugar', current_amount: 1500, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString() },

  // Pantry Staples & Condiments
  { id: 'pantry-maple-syrup', name: 'Maple Syrup', current_amount: 25, unit: 'ml', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-rice-vinegar', name: 'Rice Vinegar', current_amount: 200, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-mirin', name: 'Mirin', current_amount: 150, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-olive-oil', name: 'Olive Oil', current_amount: 500, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-canola-oil', name: 'Canola Oil', current_amount: 2000, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-tahini', name: 'Tahini', current_amount: 150, unit: 'g', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-capers', name: 'Capers', current_amount: 300, unit: 'ml', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-gochujang', name: 'Gochujang', current_amount: 500, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-pesto', name: 'Classic Pesto', current_amount: 200, unit: 'g', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-mustard-old', name: 'Old Fashioned Mustard', current_amount: 500, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-mustard-dijon', name: 'Dijon Original Mustard', current_amount: 500, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-mayo', name: 'Hellmann\'s Mayo', current_amount: 300, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-ketchup', name: 'Heinz Ketchup', current_amount: 800, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-acv', name: 'Apple Cider Vinegar', current_amount: 500, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pantry-sake', name: 'Cooking Sake', current_amount: 500, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString() },

  // Fermented & Prepared
  { id: 'fermented-kimchi', name: 'Kimchi', current_amount: 200, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'prepared-chickpeas', name: 'Cooked Chickpeas', current_amount: 250, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString() },

  // Grains & Pasta
  { id: 'grain-muesli', name: 'Muesli', current_amount: 250, unit: 'g', category: 'grains', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'grain-nutritional-yeast', name: 'Nutritional Yeast', current_amount: 142, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'grain-oats', name: 'Whole Rolled Oats', current_amount: 907, unit: 'g', category: 'grains', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pasta-lo-mein', name: 'Lo Mein Noodles', current_amount: 353, unit: 'g', category: 'grains', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pasta-vermicelli', name: 'Vermicelli', current_amount: 400, unit: 'g', category: 'grains', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pasta-lasagna', name: 'Lasagna Noodles', current_amount: 500, unit: 'g', category: 'grains', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'pasta-rigatoni', name: 'Rigatoni', current_amount: 200, unit: 'g', category: 'grains', added_by: 'simon', updated_at: new Date().toISOString() },

  // Baking & Misc
  { id: 'baking-yeast', name: 'Active Dry Yeast', current_amount: 100, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString() }
]