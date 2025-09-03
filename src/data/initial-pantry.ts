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

  // Vegetables & Fresh (with restock levels and low stock thresholds)
  { id: 'veg-cabbage', name: 'Whole Cabbage', current_amount: 1000, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 1000, normal_restock_level: 1500, low_stock_threshold: 500 },
  { id: 'veg-broccoli', name: 'Broccoli', current_amount: 500, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 500, normal_restock_level: 1000, low_stock_threshold: 200 },
  { id: 'veg-mushrooms', name: 'Crimini Mushrooms', current_amount: 225, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 250, normal_restock_level: 500, low_stock_threshold: 100 },
  { id: 'veg-roma-tomatoes', name: 'Roma Tomatoes', current_amount: 100, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 500, normal_restock_level: 800, low_stock_threshold: 200 }, // Low stock example
  { id: 'veg-cherry-tomatoes', name: 'Cherry Tomatoes', current_amount: 150, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 250, normal_restock_level: 400, low_stock_threshold: 100 },
  { id: 'veg-carrots', name: 'Carrots', current_amount: 250, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 1000, normal_restock_level: 2000, low_stock_threshold: 500 },
  { id: 'veg-eggplant', name: 'Eggplant', current_amount: 300, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 300, normal_restock_level: 600, low_stock_threshold: 150 },
  { id: 'veg-jalapeno', name: 'Jalapeño', current_amount: 15, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 50, normal_restock_level: 80, low_stock_threshold: 20 }, // Low stock example
  { id: 'veg-corn-fresh', name: 'Fresh Corn', current_amount: 600, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 600, normal_restock_level: 1200, low_stock_threshold: 300 },
  { id: 'veg-onions', name: 'Onions', current_amount: 7, unit: 'items', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 3, normal_restock_level: 10, low_stock_threshold: 2 },
  { id: 'veg-garlic', name: 'Garlic', current_amount: 30, unit: 'cloves', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 15, normal_restock_level: 45, low_stock_threshold: 10 },

  // Fruits (with seasonal availability)
  { id: 'fruit-peaches', name: 'Peaches', current_amount: 4, unit: 'items', category: 'fruits', added_by: 'simon', updated_at: new Date().toISOString(), seasonal_availability: { months: [6, 7, 8, 9], note: 'Peak season summer months' }, auto_add_to_shopping: false },
  { id: 'fruit-kiwis', name: 'Kiwis', current_amount: 3, unit: 'items', category: 'fruits', added_by: 'simon', updated_at: new Date().toISOString(), seasonal_availability: { months: [1, 2, 3, 10, 11, 12], note: 'Best in winter/early spring' } },

  // Dairy & Cheese (with restock levels and auto-shopping)
  { id: 'dairy-butter', name: 'Butter', current_amount: 500, unit: 'g', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 454, normal_restock_level: 900, low_stock_threshold: 200, auto_add_to_shopping: true }, // 1lb stick
  { id: 'dairy-milk', name: 'Milk', current_amount: 500, unit: 'ml', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 1000, normal_restock_level: 2000, low_stock_threshold: 250, auto_add_to_shopping: true }, // 1L carton
  { id: 'dairy-greek-yogurt', name: 'Greek Yogurt', current_amount: 750, unit: 'g', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 500, normal_restock_level: 1000, low_stock_threshold: 200, auto_add_to_shopping: true },
  { id: 'dairy-plain-yogurt', name: 'Plain Yogurt', current_amount: 500, unit: 'g', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 500, normal_restock_level: 1000, low_stock_threshold: 150, auto_add_to_shopping: true },
  { id: 'dairy-goat-cheese', name: 'Pure Goat Cheese', current_amount: 50, unit: 'g', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 113, normal_restock_level: 225, low_stock_threshold: 50 }, // Low stock
  { id: 'dairy-gorgonzola', name: 'Gorgonzola', current_amount: 100, unit: 'g', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 113, normal_restock_level: 225, low_stock_threshold: 40 },

  // Spices & Seasonings (with restock levels)
  { id: 'spice-ras-el-hanout', name: 'Ras El Hanout', current_amount: 85, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 80, normal_restock_level: 160, low_stock_threshold: 20 },
  { id: 'spice-tex-mex', name: 'Frontera Tex-Mex Seasoning', current_amount: 15, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 65, normal_restock_level: 130, low_stock_threshold: 25 }, // Low stock example
  { id: 'spice-garlic-salt', name: 'Deluxe Garlic Salt', current_amount: 150, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 80, normal_restock_level: 160, low_stock_threshold: 30 },
  { id: 'spice-roasting-blend', name: 'Rustic Roasting Blend', current_amount: 95, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-tarragon-shallot', name: 'Tarragon-Shallot Blend', current_amount: 75, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-marrakesh-salmon', name: 'Marrakesh Salmon Seasoning', current_amount: 110, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-salt', name: 'Salt', current_amount: 800, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-pepper', name: 'Black Pepper', current_amount: 180, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-flour', name: 'All-Purpose Flour', current_amount: 2000, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-garlic-grit', name: 'Garlic Grit', current_amount: 65, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-voodoo-pork', name: 'Voodoo Crutch (Pork)', current_amount: 50, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-voodoo-chicken', name: 'Voodoo Crutch (Chicken)', current_amount: 50, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString() },
  { id: 'spice-mustard-seeds', name: 'Yellow Mustard Seeds', current_amount: 15, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 25, normal_restock_level: 50, low_stock_threshold: 20 },
  { id: 'spice-allspice', name: 'Whole Allspice', current_amount: 8, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 15, normal_restock_level: 30, low_stock_threshold: 12 }, // Low stock
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
  { id: 'baking-yeast', name: 'Active Dry Yeast', current_amount: 100, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString() },

  // Snacks & European Specialties
  { id: 'snack-fuet', name: 'Fuet (Spanish Dry Sausage)', current_amount: 150, unit: 'g', category: 'proteins', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 100, normal_restock_level: 200, low_stock_threshold: 50 },
  { id: 'snack-crackers', name: 'European Crackers', current_amount: 200, unit: 'g', category: 'grains', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 200, normal_restock_level: 400, low_stock_threshold: 100 },
  { id: 'snack-manchego', name: 'Manchego Cheese', current_amount: 150, unit: 'g', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 100, normal_restock_level: 200, low_stock_threshold: 50 },
  { id: 'snack-marcona-almonds', name: 'Marcona Almonds', current_amount: 100, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 100, normal_restock_level: 200, low_stock_threshold: 30 },
  { id: 'snack-cornichons', name: 'French Cornichons', current_amount: 250, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 200, normal_restock_level: 400, low_stock_threshold: 50 },

  // Beverages & Teas
  { id: 'beverage-earl-grey', name: 'Earl Grey Tea', current_amount: 25, unit: 'bags', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 20, normal_restock_level: 40, low_stock_threshold: 10 },
  { id: 'beverage-green-tea', name: 'Green Tea', current_amount: 30, unit: 'bags', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 20, normal_restock_level: 40, low_stock_threshold: 10 },
  { id: 'beverage-chamomile', name: 'Chamomile Tea', current_amount: 20, unit: 'bags', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 20, normal_restock_level: 40, low_stock_threshold: 8 },
  { id: 'beverage-jasmine-tea', name: 'Jasmine Tea', current_amount: 15, unit: 'bags', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 20, normal_restock_level: 40, low_stock_threshold: 8 },
  { id: 'beverage-coffee-beans', name: 'Coffee Beans', current_amount: 500, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 250, normal_restock_level: 500, low_stock_threshold: 100 },

  // French Cuisine Staples
  { id: 'french-brie', name: 'Brie Cheese', current_amount: 200, unit: 'g', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 125, normal_restock_level: 250, low_stock_threshold: 60 },
  { id: 'french-butter-unsalted', name: 'French Unsalted Butter', current_amount: 250, unit: 'g', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 225, normal_restock_level: 450, low_stock_threshold: 100 },
  { id: 'french-shallots', name: 'French Shallots', current_amount: 150, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 100, normal_restock_level: 200, low_stock_threshold: 50 },
  { id: 'french-wine-white', name: 'Dry White Wine (Cooking)', current_amount: 500, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 375, normal_restock_level: 750, low_stock_threshold: 200 },
  { id: 'french-wine-red', name: 'Red Wine (Cooking)', current_amount: 400, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 375, normal_restock_level: 750, low_stock_threshold: 150 },
  { id: 'french-herbs-provence', name: 'Herbes de Provence', current_amount: 30, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 25, normal_restock_level: 50, low_stock_threshold: 10 },
  { id: 'french-cream-heavy', name: 'Heavy Cream (35%)', current_amount: 250, unit: 'ml', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 250, normal_restock_level: 500, low_stock_threshold: 100 },
  { id: 'french-cognac', name: 'Cognac (Cooking)', current_amount: 200, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 200, normal_restock_level: 400, low_stock_threshold: 50 },

  // Asian Cuisine Staples
  { id: 'asian-soy-sauce', name: 'Soy Sauce', current_amount: 300, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 250, normal_restock_level: 500, low_stock_threshold: 100 },
  { id: 'asian-sesame-oil', name: 'Sesame Oil', current_amount: 150, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 150, normal_restock_level: 300, low_stock_threshold: 50 },
  { id: 'asian-fish-sauce', name: 'Fish Sauce', current_amount: 200, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 200, normal_restock_level: 400, low_stock_threshold: 50 },
  { id: 'asian-oyster-sauce', name: 'Oyster Sauce', current_amount: 250, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 200, normal_restock_level: 400, low_stock_threshold: 75 },
  { id: 'asian-coconut-milk', name: 'Coconut Milk (Canned)', current_amount: 400, unit: 'ml', category: 'dairy', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 400, normal_restock_level: 800, low_stock_threshold: 200 },
  { id: 'asian-ginger-fresh', name: 'Fresh Ginger', current_amount: 100, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 75, normal_restock_level: 150, low_stock_threshold: 25 },
  { id: 'asian-lemongrass', name: 'Fresh Lemongrass', current_amount: 50, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 50, normal_restock_level: 100, low_stock_threshold: 15 },
  { id: 'asian-lime-leaves', name: 'Kaffir Lime Leaves', current_amount: 10, unit: 'leaves', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 10, normal_restock_level: 20, low_stock_threshold: 3 },
  { id: 'asian-thai-chilies', name: 'Thai Bird Chilies', current_amount: 20, unit: 'g', category: 'vegetables', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 25, normal_restock_level: 50, low_stock_threshold: 10 },
  { id: 'asian-star-anise', name: 'Star Anise', current_amount: 15, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 15, normal_restock_level: 30, low_stock_threshold: 5 },
  { id: 'asian-five-spice', name: 'Chinese Five Spice', current_amount: 25, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 25, normal_restock_level: 50, low_stock_threshold: 8 },
  { id: 'asian-wasabi-paste', name: 'Wasabi Paste', current_amount: 75, unit: 'g', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 50, normal_restock_level: 100, low_stock_threshold: 20 },

  // International Pantry Staples
  { id: 'international-harissa', name: 'Harissa Paste', current_amount: 100, unit: 'g', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 100, normal_restock_level: 200, low_stock_threshold: 30 },
  { id: 'international-sumac', name: 'Sumac', current_amount: 40, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 30, normal_restock_level: 60, low_stock_threshold: 15 },
  { id: 'international-za-atar', name: 'Za\'atar', current_amount: 50, unit: 'g', category: 'spices', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 40, normal_restock_level: 80, low_stock_threshold: 15 },
  { id: 'international-pomegranate-molasses', name: 'Pomegranate Molasses', current_amount: 150, unit: 'ml', category: 'oils', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 150, normal_restock_level: 300, low_stock_threshold: 50 },
  { id: 'international-preserved-lemons', name: 'Preserved Lemons', current_amount: 200, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 200, normal_restock_level: 400, low_stock_threshold: 75 },
  { id: 'international-miso-paste', name: 'White Miso Paste', current_amount: 250, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 200, normal_restock_level: 400, low_stock_threshold: 75 },
  { id: 'international-chipotle-adobo', name: 'Chipotle Peppers in Adobo', current_amount: 200, unit: 'g', category: 'pantry', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 200, normal_restock_level: 400, low_stock_threshold: 50 },
  { id: 'international-anchovies', name: 'Anchovies (Canned)', current_amount: 60, unit: 'g', category: 'proteins', added_by: 'simon', updated_at: new Date().toISOString(), min_buy_amount: 50, normal_restock_level: 100, low_stock_threshold: 20 }
]