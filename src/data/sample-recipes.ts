import type { SimpleRecipe } from '@/types/simple'

export const sampleRecipes: SimpleRecipe[] = [
  {
    id: 'recipe-ground-beef-stir-fry',
    title: 'Ground Beef Stir Fry',
    servings: 4,
    prep_time: 15,
    cook_time: 10,
    ingredients: [
      { name: 'Medium Ground Beef', amount: 454, unit: 'g', pantry_item_id: 'meat-ground-beef' },
      { name: 'Frozen Corn', amount: 100, unit: 'g', pantry_item_id: 'frozen-corn' },
      { name: 'Onions', amount: 1, unit: 'items', pantry_item_id: 'veg-onions' },
      { name: 'Garlic', amount: 2, unit: 'cloves', pantry_item_id: 'veg-garlic' },
      { name: 'Cooking Sake', amount: 30, unit: 'ml', pantry_item_id: 'pantry-sake' },
      { name: 'Canola Oil', amount: 15, unit: 'ml', pantry_item_id: 'pantry-canola-oil' },
      { name: 'Salt', amount: 5, unit: 'g', pantry_item_id: 'spice-salt' },
      { name: 'Black Pepper', amount: 2, unit: 'g', pantry_item_id: 'spice-pepper' }
    ],
    instructions: [
      'Heat canola oil in large pan over medium-high heat',
      'Add ground beef, cook until browned (5-6 minutes)',
      'Add diced onions and minced garlic, cook 2 minutes until fragrant',
      'Add frozen corn and cooking sake, stir-fry 3-4 minutes',
      'Season with salt and pepper to taste',
      'Serve hot over rice or noodles'
    ],
    tags: ['quick', 'protein', 'stir-fry'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },
  {
    id: 'recipe-pork-leek-dumplings',
    title: 'Pan-Fried Pork & Leek Dumplings',
    servings: 2,
    prep_time: 5,
    cook_time: 12,
    ingredients: [
      { name: 'Pork & Leek Dumplings', amount: 250, unit: 'g', pantry_item_id: 'frozen-dumplings' },
      { name: 'Canola Oil', amount: 20, unit: 'ml', pantry_item_id: 'pantry-canola-oil' },
      { name: 'Rice Vinegar', amount: 15, unit: 'ml', pantry_item_id: 'pantry-rice-vinegar' },
      { name: 'Gochujang', amount: 10, unit: 'g', pantry_item_id: 'pantry-gochujang', optional: true }
    ],
    instructions: [
      'Heat canola oil in non-stick pan over medium heat',
      'Add frozen dumplings in single layer, do not overcrowd',
      'Cook 3-4 minutes until bottom is golden brown',
      'Add 60ml water, cover immediately and steam 6-8 minutes',
      'Remove lid and cook 1 minute to crisp bottom again',
      'Serve with rice vinegar dipping sauce mixed with gochujang if desired'
    ],
    tags: ['frozen', 'quick', 'asian'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },
  {
    id: 'recipe-tofu-kimchi-stir-fry',
    title: 'Tofu & Kimchi Stir Fry',
    servings: 2,
    prep_time: 10,
    cook_time: 8,
    ingredients: [
      { name: 'Firm Tofu', amount: 225, unit: 'g', pantry_item_id: 'protein-tofu' },
      { name: 'Kimchi', amount: 100, unit: 'g', pantry_item_id: 'fermented-kimchi' },
      { name: 'Canola Oil', amount: 15, unit: 'ml', pantry_item_id: 'pantry-canola-oil' },
      { name: 'Garlic', amount: 2, unit: 'cloves', pantry_item_id: 'veg-garlic' },
      { name: 'Cooking Sake', amount: 20, unit: 'ml', pantry_item_id: 'pantry-sake' },
      { name: 'Nutritional Yeast', amount: 10, unit: 'g', pantry_item_id: 'grain-nutritional-yeast', optional: true }
    ],
    instructions: [
      'Drain tofu and cut into 2cm cubes',
      'Heat oil in wok or large pan over medium-high heat',
      'Add tofu cubes, cook 3-4 minutes until golden on all sides',
      'Add minced garlic, cook 30 seconds until fragrant',
      'Add kimchi with some of its juice, stir-fry 2-3 minutes',
      'Add sake and cook 1 minute to deglaze',
      'Sprinkle with nutritional yeast if using and serve over rice'
    ],
    tags: ['vegetarian', 'fermented', 'korean'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },
  {
    id: 'recipe-roasted-cauliflower',
    title: 'Ras El Hanout Roasted Cauliflower',
    servings: 4,
    prep_time: 5,
    cook_time: 25,
    ingredients: [
      { name: 'Frozen Cauliflower', amount: 400, unit: 'g', pantry_item_id: 'frozen-cauliflower' },
      { name: 'Olive Oil', amount: 30, unit: 'ml', pantry_item_id: 'pantry-olive-oil' },
      { name: 'Ras El Hanout', amount: 8, unit: 'g', pantry_item_id: 'spice-ras-el-hanout' },
      { name: 'Salt', amount: 3, unit: 'g', pantry_item_id: 'spice-salt' },
      { name: 'Pure Goat Cheese', amount: 50, unit: 'g', pantry_item_id: 'dairy-goat-cheese', optional: true }
    ],
    instructions: [
      'Preheat oven to 425°F (220°C)',
      'Thaw frozen cauliflower if needed, drain well and pat dry',
      'Toss cauliflower with olive oil, Ras El Hanout, and salt',
      'Spread on baking sheet in single layer',
      'Roast 20-25 minutes until edges are golden and crispy',
      'Crumble goat cheese on top while hot if using',
      'Serve as side dish or over grains'
    ],
    tags: ['vegetarian', 'roasted', 'middle-eastern'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },
  {
    id: 'recipe-bacon-mushroom-pasta',
    title: 'Bacon & Mushroom Rigatoni',
    servings: 3,
    prep_time: 10,
    cook_time: 15,
    ingredients: [
      { name: 'Rigatoni', amount: 200, unit: 'g', pantry_item_id: 'pasta-rigatoni' },
      { name: 'Double Smoked Sliced Bacon', amount: 125, unit: 'g', pantry_item_id: 'meat-bacon' },
      { name: 'Crimini Mushrooms', amount: 6, unit: 'items', pantry_item_id: 'veg-mushrooms' },
      { name: 'Onions', amount: 0.5, unit: 'items', pantry_item_id: 'veg-onions' },
      { name: 'Garlic', amount: 3, unit: 'cloves', pantry_item_id: 'veg-garlic' },
      { name: 'Butter', amount: 15, unit: 'g', pantry_item_id: 'dairy-butter' },
      { name: 'Black Pepper', amount: 2, unit: 'g', pantry_item_id: 'spice-pepper' },
      { name: 'Salt', amount: 3, unit: 'g', pantry_item_id: 'spice-salt' }
    ],
    instructions: [
      'Cook rigatoni according to package directions, reserve 1 cup pasta water',
      'While pasta cooks, chop bacon into small pieces',
      'Cook bacon in large pan over medium heat until crispy, remove to paper towels',
      'In same pan with bacon fat, sauté sliced mushrooms until golden (5 minutes)',
      'Add diced onion and garlic, cook 2 minutes until soft',
      'Add butter, cooked bacon, and drained pasta to pan',
      'Toss with pasta water as needed to create silky sauce',
      'Season with salt and pepper to taste'
    ],
    tags: ['pasta', 'bacon', 'comfort-food'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },
  {
    id: 'recipe-test-missing-ingredients',
    title: 'Test Recipe with Missing Ingredients',
    servings: 2,
    prep_time: 5,
    cook_time: 10,
    ingredients: [
      { name: 'Ground Beef', amount: 200, unit: 'g', pantry_item_id: 'meat-ground-beef' }, // We have this
      { name: 'Bell Pepper', amount: 1, unit: 'items' }, // We DON'T have this - should appear in shopping list
      { name: 'Cheddar Cheese', amount: 100, unit: 'g' }, // We DON'T have this - should appear in shopping list
      { name: 'Onions', amount: 0.5, unit: 'items', pantry_item_id: 'veg-onions' } // We have this, test decimal
    ],
    instructions: [
      'Test recipe to verify shopping list generation for missing ingredients',
      'Brown the ground beef with diced onions',
      'Add bell pepper and cook until tender',
      'Top with cheese and serve'
    ],
    tags: ['test', 'quick'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  }
]