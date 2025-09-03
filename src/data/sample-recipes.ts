import type { SimpleRecipe } from '@/types/simple'

export const sampleRecipes: SimpleRecipe[] = [
  // European-inspired appetizer using new staples
  {
    id: 'recipe-fuet-manchego-plate',
    title: 'Spanish Charcuterie Plate',
    servings: 4,
    prep_time: 10,
    cook_time: 0,
    ingredients: [
      { name: 'Fuet (Spanish Dry Sausage)', amount: 100, unit: 'g', pantry_item_id: 'snack-fuet' },
      { name: 'Manchego Cheese', amount: 100, unit: 'g', pantry_item_id: 'snack-manchego' },
      { name: 'European Crackers', amount: 50, unit: 'g', pantry_item_id: 'snack-crackers' },
      { name: 'Marcona Almonds', amount: 40, unit: 'g', pantry_item_id: 'snack-marcona-almonds' },
      { name: 'French Cornichons', amount: 30, unit: 'g', pantry_item_id: 'snack-cornichons' }
    ],
    instructions: [
      'Slice fuet into thin rounds and arrange on serving board',
      'Cut manchego into wedges or cubes',
      'Arrange crackers, almonds, and cornichons around the board',
      'Serve at room temperature with wine or tea'
    ],
    tags: ['appetizer', 'no-cook', 'spanish', 'charcuterie'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // French-inspired recipe with new ingredients
  {
    id: 'recipe-brie-cognac-sauce',
    title: 'Creamy Brie and Cognac Sauce',
    servings: 4,
    prep_time: 5,
    cook_time: 15,
    ingredients: [
      { name: 'Brie Cheese', amount: 150, unit: 'g', pantry_item_id: 'french-brie' },
      { name: 'Heavy Cream (35%)', amount: 200, unit: 'ml', pantry_item_id: 'french-cream-heavy' },
      { name: 'Cognac (Cooking)', amount: 30, unit: 'ml', pantry_item_id: 'french-cognac' },
      { name: 'French Shallots', amount: 25, unit: 'g', pantry_item_id: 'french-shallots' },
      { name: 'French Unsalted Butter', amount: 20, unit: 'g', pantry_item_id: 'french-butter-unsalted' },
      { name: 'Herbes de Provence', amount: 2, unit: 'g', pantry_item_id: 'french-herbs-provence' }
    ],
    instructions: [
      'Finely mince shallots and sauté in butter until soft',
      'Add cognac and let alcohol cook off (2 minutes)',
      'Add heavy cream and herbes de provence, simmer gently',
      'Remove rind from brie and whisk cheese into warm cream',
      'Season with salt and pepper to taste',
      'Serve over pasta, chicken, or vegetables'
    ],
    tags: ['sauce', 'french', 'creamy', 'luxury'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // Asian fusion recipe with new ingredients
  {
    id: 'recipe-coconut-ginger-chicken',
    title: 'Thai-Style Coconut Ginger Chicken',
    servings: 4,
    prep_time: 20,
    cook_time: 25,
    ingredients: [
      { name: 'Chicken Legs/Thighs', amount: 800, unit: 'g', pantry_item_id: 'meat-chicken-legs' },
      { name: 'Coconut Milk (Canned)', amount: 300, unit: 'ml', pantry_item_id: 'asian-coconut-milk' },
      { name: 'Fresh Ginger', amount: 30, unit: 'g', pantry_item_id: 'asian-ginger-fresh' },
      { name: 'Fresh Lemongrass', amount: 20, unit: 'g', pantry_item_id: 'asian-lemongrass' },
      { name: 'Fish Sauce', amount: 15, unit: 'ml', pantry_item_id: 'asian-fish-sauce' },
      { name: 'Thai Bird Chilies', amount: 5, unit: 'g', pantry_item_id: 'asian-thai-chilies' },
      { name: 'Kaffir Lime Leaves', amount: 4, unit: 'leaves', pantry_item_id: 'asian-lime-leaves' },
      { name: 'Canola Oil', amount: 15, unit: 'ml', pantry_item_id: 'pantry-canola-oil' }
    ],
    instructions: [
      'Cut chicken into bite-sized pieces and season with salt',
      'Bruise lemongrass with knife handle, slice ginger thinly',
      'Heat oil in large pan, brown chicken pieces (8 minutes)',
      'Add ginger, lemongrass, chilies, and lime leaves, cook 2 minutes',
      'Pour in coconut milk and fish sauce, bring to simmer',
      'Cover and cook 15 minutes until chicken is tender',
      'Serve over rice with fresh herbs'
    ],
    tags: ['thai', 'coconut', 'spicy', 'asian'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // Recipe utilizing yogurt and Middle Eastern flavors
  {
    id: 'recipe-yogurt-harissa-lamb',
    title: 'Greek Yogurt Harissa Marinated Beef',
    servings: 4,
    prep_time: 30,
    cook_time: 15,
    ingredients: [
      { name: 'Budget Steaks', amount: 600, unit: 'g', pantry_item_id: 'meat-budget-steaks' },
      { name: 'Greek Yogurt', amount: 150, unit: 'g', pantry_item_id: 'dairy-greek-yogurt' },
      { name: 'Harissa Paste', amount: 20, unit: 'g', pantry_item_id: 'international-harissa' },
      { name: 'Za\'atar', amount: 10, unit: 'g', pantry_item_id: 'international-za-atar' },
      { name: 'Pomegranate Molasses', amount: 15, unit: 'ml', pantry_item_id: 'international-pomegranate-molasses' },
      { name: 'Olive Oil', amount: 30, unit: 'ml', pantry_item_id: 'pantry-olive-oil' },
      { name: 'Garlic', amount: 3, unit: 'cloves', pantry_item_id: 'veg-garlic' }
    ],
    instructions: [
      'Mix yogurt, harissa, minced garlic, and olive oil for marinade',
      'Marinate steaks in mixture for at least 30 minutes',
      'Heat grill or heavy pan to medium-high',
      'Cook steaks 4-5 minutes per side for medium-rare',
      'Let rest 5 minutes, then slice against grain',
      'Drizzle with pomegranate molasses and sprinkle za\'atar',
      'Serve with yogurt sauce and warm bread'
    ],
    tags: ['middle-eastern', 'marinated', 'grilled', 'yogurt'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // Tea-infused recipe
  {
    id: 'recipe-earl-grey-pork',
    title: 'Earl Grey Tea-Smoked Pork Roast',
    servings: 6,
    prep_time: 15,
    cook_time: 90,
    ingredients: [
      { name: 'Pork Roast', amount: 1200, unit: 'g', pantry_item_id: 'meat-pork-roast' },
      { name: 'Earl Grey Tea', amount: 6, unit: 'bags', pantry_item_id: 'beverage-earl-grey' },
      { name: 'White Sugar', amount: 50, unit: 'g', pantry_item_id: 'spice-sugar' },
      { name: 'Salt', amount: 15, unit: 'g', pantry_item_id: 'spice-salt' },
      { name: 'Black Pepper', amount: 5, unit: 'g', pantry_item_id: 'spice-pepper' },
      { name: 'Olive Oil', amount: 30, unit: 'ml', pantry_item_id: 'pantry-olive-oil' },
      { name: 'Herbes de Provence', amount: 8, unit: 'g', pantry_item_id: 'french-herbs-provence' }
    ],
    instructions: [
      'Empty tea bags and mix tea leaves with sugar for smoking',
      'Season pork with salt, pepper, and herbes de provence',
      'Sear pork in oil until browned on all sides (8 minutes)',
      'Set up smoking setup with tea-sugar mixture in heavy pot',
      'Place pork on rack above smoking mixture, cover tightly',
      'Smoke-roast in 325°F oven for 75-90 minutes until 145°F internal',
      'Rest 10 minutes before slicing'
    ],
    tags: ['smoked', 'tea', 'roast', 'unique'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },
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

  // === SIGNATURE SAUCES ===
  {
    id: 'sauce-garlic-gochujang-glaze',
    title: 'Garlic Gochujang Glaze',
    servings: 8,
    prep_time: 5,
    cook_time: 10,
    ingredients: [
      { name: 'Gochujang', amount: 60, unit: 'g', pantry_item_id: 'pantry-gochujang' },
      { name: 'Rice Vinegar', amount: 30, unit: 'ml', pantry_item_id: 'pantry-rice-vinegar' },
      { name: 'Mirin', amount: 45, unit: 'ml', pantry_item_id: 'pantry-mirin' },
      { name: 'Cooking Sake', amount: 30, unit: 'ml', pantry_item_id: 'pantry-sake' },
      { name: 'Garlic', amount: 4, unit: 'cloves', pantry_item_id: 'veg-garlic' },
      { name: 'White Sugar', amount: 15, unit: 'g', pantry_item_id: 'spice-sugar' },
      { name: 'Canola Oil', amount: 15, unit: 'ml', pantry_item_id: 'pantry-canola-oil' }
    ],
    instructions: [
      'Heat oil in small saucepan over medium heat',
      'Add minced garlic, cook 30 seconds until fragrant',
      'Whisk in gochujang until smooth',
      'Add rice vinegar, mirin, sake, and sugar',
      'Simmer 8-10 minutes, stirring frequently, until thickened',
      'Cool slightly - glaze will thicken more as it cools',
      'Perfect for grilled meats, roasted vegetables, or as a dipping sauce'
    ],
    tags: ['sauce', 'korean', 'glaze', 'spicy'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },
  {
    id: 'sauce-tahini-herb-dressing',
    title: 'Creamy Tahini Herb Dressing',
    servings: 6,
    prep_time: 10,
    cook_time: 0,
    ingredients: [
      { name: 'Tahini', amount: 80, unit: 'g', pantry_item_id: 'pantry-tahini' },
      { name: 'Apple Cider Vinegar', amount: 45, unit: 'ml', pantry_item_id: 'pantry-acv' },
      { name: 'Olive Oil', amount: 60, unit: 'ml', pantry_item_id: 'pantry-olive-oil' },
      { name: 'Garlic', amount: 2, unit: 'cloves', pantry_item_id: 'veg-garlic' },
      { name: 'Fresh Lemon Juice', amount: 30, unit: 'ml' },
      { name: 'Fresh Parsley', amount: 20, unit: 'g' },
      { name: 'Fresh Dill', amount: 10, unit: 'g' },
      { name: 'Salt', amount: 5, unit: 'g', pantry_item_id: 'spice-salt' },
      { name: 'Water', amount: 60, unit: 'ml' }
    ],
    instructions: [
      'In food processor or blender, combine tahini, lemon juice, and vinegar',
      'Add minced garlic, salt, and fresh herbs',
      'With motor running, slowly drizzle in olive oil',
      'Add water gradually until desired consistency is reached',
      'Taste and adjust seasoning - add more lemon for tang, salt for flavor',
      'Refrigerate up to 1 week - thin with water if needed',
      'Excellent on salads, roasted vegetables, grilled chicken, or as a dip'
    ],
    tags: ['sauce', 'dressing', 'middle-eastern', 'healthy'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },
  {
    id: 'sauce-mustard-maple-marinade',
    title: 'Whole Grain Mustard Maple Marinade',
    servings: 4,
    prep_time: 5,
    cook_time: 0,
    ingredients: [
      { name: 'Dijon Original Mustard', amount: 45, unit: 'ml', pantry_item_id: 'pantry-mustard-dijon' },
      { name: 'Old Fashioned Mustard', amount: 30, unit: 'ml', pantry_item_id: 'pantry-mustard-old' },
      { name: 'Yellow Mustard Seeds', amount: 8, unit: 'g', pantry_item_id: 'spice-mustard-seeds' },
      { name: 'Maple Syrup', amount: 45, unit: 'ml', pantry_item_id: 'pantry-maple-syrup' },
      { name: 'Apple Cider Vinegar', amount: 30, unit: 'ml', pantry_item_id: 'pantry-acv' },
      { name: 'Canola Oil', amount: 30, unit: 'ml', pantry_item_id: 'pantry-canola-oil' },
      { name: 'Garlic', amount: 2, unit: 'cloves', pantry_item_id: 'veg-garlic' },
      { name: 'Black Pepper', amount: 3, unit: 'g', pantry_item_id: 'spice-pepper' }
    ],
    instructions: [
      'Lightly crush mustard seeds with flat of knife or in mortar',
      'Whisk together both mustards, maple syrup, and vinegar',
      'Add minced garlic, crushed mustard seeds, and black pepper',
      'Slowly whisk in canola oil until emulsified',
      'Perfect marinade for pork tenderloin, chicken thighs, or beef roast',
      'Marinate proteins 2-8 hours, reserve some sauce for serving',
      'Also excellent brushed on vegetables before roasting'
    ],
    tags: ['sauce', 'marinade', 'mustard', 'sweet-savory'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // === MAIN DISHES ===
  {
    id: 'recipe-korean-beef-bowls',
    title: 'Korean-Style Beef Rice Bowls',
    servings: 4,
    prep_time: 15,
    cook_time: 12,
    ingredients: [
      { name: 'Medium Ground Beef', amount: 600, unit: 'g', pantry_item_id: 'meat-ground-beef' },
      { name: 'Garlic Gochujang Glaze', amount: 80, unit: 'g', recipe_id: 'sauce-garlic-gochujang-glaze' },
      { name: 'Kimchi', amount: 150, unit: 'g', pantry_item_id: 'fermented-kimchi' },
      { name: 'Jasmine Rice', amount: 300, unit: 'g' },
      { name: 'Onions', amount: 1, unit: 'items', pantry_item_id: 'veg-onions' },
      { name: 'Fresh Cucumber', amount: 1, unit: 'items' },
      { name: 'Sesame Seeds', amount: 10, unit: 'g' },
      { name: 'Canola Oil', amount: 15, unit: 'ml', pantry_item_id: 'pantry-canola-oil' }
    ],
    instructions: [
      'Cook jasmine rice according to package directions',
      'Heat oil in large skillet over medium-high heat',
      'Add diced onions, cook 3 minutes until softened',
      'Add ground beef, cook 6-8 minutes breaking up with spoon until browned',
      'Stir in gochujang glaze, cook 2 minutes until beef is well coated',
      'Slice cucumber into thin rounds, roughly chop kimchi',
      'Serve beef over rice topped with kimchi, cucumber, and sesame seeds',
      'Drizzle any pan juices over the bowls'
    ],
    tags: ['korean', 'rice-bowl', 'spicy', 'comfort'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },
  {
    id: 'recipe-maple-mustard-pork',
    title: 'Maple Mustard Glazed Pork Roast',
    servings: 6,
    prep_time: 20,
    cook_time: 90,
    ingredients: [
      { name: 'Pork Roast', amount: 1200, unit: 'g', pantry_item_id: 'meat-pork-roast' },
      { name: 'Mustard Maple Marinade', amount: 120, unit: 'ml', recipe_id: 'sauce-mustard-maple-marinade' },
      { name: 'Roma Tomatoes', amount: 300, unit: 'g', pantry_item_id: 'veg-roma-tomatoes' },
      { name: 'Onions', amount: 2, unit: 'items', pantry_item_id: 'veg-onions' },
      { name: 'Carrots', amount: 200, unit: 'g', pantry_item_id: 'veg-carrots' },
      { name: 'Olive Oil', amount: 30, unit: 'ml', pantry_item_id: 'pantry-olive-oil' },
      { name: 'Salt', amount: 8, unit: 'g', pantry_item_id: 'spice-salt' },
      { name: 'Black Pepper', amount: 4, unit: 'g', pantry_item_id: 'spice-pepper' }
    ],
    instructions: [
      'Marinate pork roast in mustard maple marinade for 4-8 hours',
      'Preheat oven to 375°F (190°C)',
      'Cut vegetables into large chunks, toss with olive oil, salt, and pepper',
      'Place marinated pork in roasting pan, surround with vegetables',
      'Roast 60-75 minutes until internal temp reaches 145°F (63°C)',
      'Baste with pan juices every 20 minutes',
      'Rest 10 minutes before slicing',
      'Serve with roasted vegetables and pan juices'
    ],
    tags: ['pork', 'roast', 'sunday-dinner', 'maple'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },
  {
    id: 'recipe-middle-eastern-chickpea-bowl',
    title: 'Middle Eastern Chickpea Power Bowl',
    servings: 3,
    prep_time: 15,
    cook_time: 20,
    ingredients: [
      { name: 'Cooked Chickpeas', amount: 400, unit: 'g', pantry_item_id: 'prepared-chickpeas' },
      { name: 'Tahini Herb Dressing', amount: 80, unit: 'ml', recipe_id: 'sauce-tahini-herb-dressing' },
      { name: 'Roma Tomatoes', amount: 200, unit: 'g', pantry_item_id: 'veg-roma-tomatoes' },
      { name: 'Fresh Cucumber', amount: 1, unit: 'items' },
      { name: 'Red Onion', amount: 0.25, unit: 'items' },
      { name: 'Ras El Hanout', amount: 6, unit: 'g', pantry_item_id: 'spice-ras-el-hanout' },
      { name: 'Olive Oil', amount: 20, unit: 'ml', pantry_item_id: 'pantry-olive-oil' },
      { name: 'Pita Bread', amount: 3, unit: 'items' },
      { name: 'Pure Goat Cheese', amount: 75, unit: 'g', pantry_item_id: 'dairy-goat-cheese' }
    ],
    instructions: [
      'Heat olive oil in pan over medium heat',
      'Add chickpeas and Ras El Hanout, cook 5-6 minutes until warmed and fragrant',
      'Dice tomatoes and cucumber, thinly slice red onion',
      'Warm pita bread in toaster or oven',
      'Arrange spiced chickpeas in bowls',
      'Top with diced vegetables and crumbled goat cheese',
      'Drizzle generously with tahini herb dressing',
      'Serve with warm pita bread on the side'
    ],
    tags: ['vegetarian', 'middle-eastern', 'healthy', 'bowl'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },
  {
    id: 'recipe-beef-stew-allspice',
    title: 'Warming Beef Stew with Whole Allspice',
    servings: 6,
    prep_time: 25,
    cook_time: 120,
    ingredients: [
      { name: 'Beef Stew/Stir Fry', amount: 800, unit: 'g', pantry_item_id: 'meat-beef-stew' },
      { name: 'Carrots', amount: 300, unit: 'g', pantry_item_id: 'veg-carrots' },
      { name: 'Onions', amount: 2, unit: 'items', pantry_item_id: 'veg-onions' },
      { name: 'Roma Tomatoes', amount: 200, unit: 'g', pantry_item_id: 'veg-roma-tomatoes' },
      { name: 'Whole Allspice', amount: 4, unit: 'g', pantry_item_id: 'spice-allspice' },
      { name: 'All-Purpose Flour', amount: 30, unit: 'g', pantry_item_id: 'spice-flour' },
      { name: 'Beef Broth', amount: 1000, unit: 'ml' },
      { name: 'Red Wine', amount: 200, unit: 'ml' },
      { name: 'Canola Oil', amount: 30, unit: 'ml', pantry_item_id: 'pantry-canola-oil' },
      { name: 'Salt', amount: 8, unit: 'g', pantry_item_id: 'spice-salt' },
      { name: 'Black Pepper', amount: 4, unit: 'g', pantry_item_id: 'spice-pepper' }
    ],
    instructions: [
      'Cut beef into 3cm chunks, season with salt and pepper',
      'Toss beef with flour until lightly coated',
      'Heat oil in heavy pot over medium-high heat',
      'Brown beef in batches, don\'t overcrowd, about 8 minutes total',
      'Add diced onions, cook 5 minutes until softened',
      'Add chopped tomatoes, whole allspice, cook 3 minutes',
      'Pour in red wine, scrape up browned bits',
      'Add beef broth, bring to boil, then reduce to simmer',
      'Cover and simmer 1.5 hours until beef is tender',
      'Add carrots in final 30 minutes of cooking',
      'Remove allspice before serving, adjust seasoning'
    ],
    tags: ['beef', 'stew', 'comfort', 'winter'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // === CREATIVE FUSION DISHES ===
  {
    id: 'recipe-bacon-kimchi-fried-rice',
    title: 'Bacon Kimchi Fried Rice',
    servings: 4,
    prep_time: 10,
    cook_time: 15,
    ingredients: [
      { name: 'Cooked Day-Old Rice', amount: 400, unit: 'g' },
      { name: 'Double Smoked Sliced Bacon', amount: 150, unit: 'g', pantry_item_id: 'meat-bacon' },
      { name: 'Kimchi', amount: 120, unit: 'g', pantry_item_id: 'fermented-kimchi' },
      { name: 'Eggs', amount: 3, unit: 'items' },
      { name: 'Garlic', amount: 3, unit: 'cloves', pantry_item_id: 'veg-garlic' },
      { name: 'Cooking Sake', amount: 30, unit: 'ml', pantry_item_id: 'pantry-sake' },
      { name: 'Canola Oil', amount: 15, unit: 'ml', pantry_item_id: 'pantry-canola-oil' },
      { name: 'Sesame Oil', amount: 10, unit: 'ml' },
      { name: 'Green Onions', amount: 2, unit: 'items' }
    ],
    instructions: [
      'Chop bacon into small pieces, cook until crispy, reserve fat',
      'Roughly chop kimchi, reserving some juice',
      'Beat eggs with a pinch of salt',
      'Heat wok or large pan over high heat with bacon fat and oil',
      'Add cold rice, breaking up clumps, stir-fry 3-4 minutes',
      'Push rice to one side, scramble eggs on empty side',
      'Add minced garlic, cook 30 seconds until fragrant',
      'Add kimchi and sake, stir everything together',
      'Add crispy bacon and sesame oil, toss to combine',
      'Garnish with sliced green onions before serving'
    ],
    tags: ['fusion', 'fried-rice', 'bacon', 'korean'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },
  {
    id: 'recipe-seitan-pesto-pasta',
    title: 'Seitan and Pesto Rigatoni',
    servings: 3,
    prep_time: 10,
    cook_time: 15,
    ingredients: [
      { name: 'Rigatoni', amount: 225, unit: 'g', pantry_item_id: 'pasta-rigatoni' },
      { name: 'Beefless Tenders (Seitan)', amount: 200, unit: 'g', pantry_item_id: 'protein-seitan' },
      { name: 'Classic Pesto', amount: 60, unit: 'g', pantry_item_id: 'pantry-pesto' },
      { name: 'Roma Tomatoes', amount: 200, unit: 'g', pantry_item_id: 'veg-roma-tomatoes' },
      { name: 'Garlic', amount: 2, unit: 'cloves', pantry_item_id: 'veg-garlic' },
      { name: 'Nutritional Yeast', amount: 20, unit: 'g', pantry_item_id: 'grain-nutritional-yeast' },
      { name: 'Olive Oil', amount: 30, unit: 'ml', pantry_item_id: 'pantry-olive-oil' },
      { name: 'Black Pepper', amount: 2, unit: 'g', pantry_item_id: 'spice-pepper' }
    ],
    instructions: [
      'Cook rigatoni according to package directions, reserve 1 cup pasta water',
      'Slice seitan into bite-sized pieces',
      'Heat olive oil in large pan over medium-high heat',
      'Add seitan, cook 4-5 minutes until golden and crispy edges',
      'Add minced garlic, cook 1 minute until fragrant',
      'Add diced tomatoes, cook 3-4 minutes until slightly softened',
      'Add drained pasta, pesto, and splash of pasta water',
      'Toss until pasta is well coated and creamy',
      'Season with pepper, top with nutritional yeast',
      'Serve immediately while hot'
    ],
    tags: ['vegetarian', 'pasta', 'pesto', 'quick'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // === BREAKFAST & BRUNCH ===
  {
    id: 'recipe-muesli-power-breakfast',
    title: 'Protein-Packed Muesli Bowl',
    servings: 2,
    prep_time: 5,
    cook_time: 0,
    ingredients: [
      { name: 'Muesli', amount: 120, unit: 'g', pantry_item_id: 'grain-muesli' },
      { name: 'Whole Rolled Oats', amount: 40, unit: 'g', pantry_item_id: 'grain-oats' },
      { name: 'Milk', amount: 300, unit: 'ml', pantry_item_id: 'dairy-milk' },
      { name: 'Greek Yogurt', amount: 150, unit: 'g' },
      { name: 'Fresh Berries', amount: 100, unit: 'g' },
      { name: 'Maple Syrup', amount: 20, unit: 'ml', pantry_item_id: 'pantry-maple-syrup' },
      { name: 'Chopped Nuts', amount: 30, unit: 'g' }
    ],
    instructions: [
      'Combine muesli and oats in serving bowls',
      'Pour milk over mixture, let soak 3-5 minutes',
      'Top with dollops of Greek yogurt',
      'Add fresh berries and chopped nuts',
      'Drizzle with maple syrup to taste',
      'Perfect make-ahead breakfast - prepare night before for softer texture'
    ],
    tags: ['breakfast', 'healthy', 'no-cook', 'protein'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // === TEST RECIPE ===
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
  },

  // Simple Recipe 1: Quick Yogurt Breakfast Bowl
  {
    id: 'recipe-simple-yogurt-bowl',
    title: 'Greek Yogurt Berry Bowl',
    servings: 1,
    prep_time: 5,
    cook_time: 0,
    ingredients: [
      { name: 'Greek Yogurt', amount: 200, unit: 'g', pantry_item_id: 'dairy-greek-yogurt' },
      { name: 'Muesli', amount: 50, unit: 'g', pantry_item_id: 'grain-muesli' },
      { name: 'Maple Syrup', amount: 15, unit: 'ml', pantry_item_id: 'pantry-maple-syrup' },
      { name: 'Marcona Almonds', amount: 20, unit: 'g', pantry_item_id: 'snack-marcona-almonds' }
    ],
    instructions: [
      'Place Greek yogurt in a bowl',
      'Top with muesli and chopped almonds',
      'Drizzle with maple syrup',
      'Serve immediately for a nutritious breakfast'
    ],
    tags: ['breakfast', 'no-cook', 'healthy', 'quick'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // Simple Recipe 2: Asian-Style Steamed Vegetables
  {
    id: 'recipe-simple-asian-vegetables',
    title: 'Sesame Ginger Vegetables',
    servings: 4,
    prep_time: 10,
    cook_time: 15,
    ingredients: [
      { name: 'Broccoli', amount: 400, unit: 'g', pantry_item_id: 'veg-broccoli' },
      { name: 'Carrots', amount: 200, unit: 'g', pantry_item_id: 'veg-carrots' },
      { name: 'Fresh Ginger', amount: 15, unit: 'g', pantry_item_id: 'asian-ginger-fresh' },
      { name: 'Sesame Oil', amount: 15, unit: 'ml', pantry_item_id: 'asian-sesame-oil' },
      { name: 'Soy Sauce', amount: 20, unit: 'ml', pantry_item_id: 'asian-soy-sauce' },
      { name: 'Garlic', amount: 2, unit: 'cloves', pantry_item_id: 'veg-garlic' }
    ],
    instructions: [
      'Cut broccoli into florets and slice carrots thinly',
      'Steam vegetables for 8-10 minutes until tender-crisp',
      'Grate ginger and mince garlic',
      'Mix sesame oil, soy sauce, ginger, and garlic',
      'Toss hot vegetables with dressing and serve'
    ],
    tags: ['vegetarian', 'healthy', 'asian', 'side-dish'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // Simple Recipe 3: Quick Tea-Infused Rice
  {
    id: 'recipe-simple-tea-rice',
    title: 'Earl Grey Infused Rice',
    servings: 4,
    prep_time: 5,
    cook_time: 25,
    ingredients: [
      { name: 'Jasmine Rice', amount: 200, unit: 'g' },
      { name: 'Earl Grey Tea', amount: 2, unit: 'bags', pantry_item_id: 'beverage-earl-grey' },
      { name: 'Butter', amount: 20, unit: 'g', pantry_item_id: 'dairy-butter' },
      { name: 'Salt', amount: 3, unit: 'g', pantry_item_id: 'spice-salt' }
    ],
    instructions: [
      'Brew 2 cups strong Earl Grey tea for 5 minutes, remove bags',
      'Bring tea to boil, add rice and salt',
      'Reduce heat, cover and simmer 18 minutes',
      'Let stand 5 minutes, fluff with fork',
      'Stir in butter before serving'
    ],
    tags: ['side-dish', 'unique', 'tea', 'simple'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // Simple Recipe 4: Mediterranean Chickpea Salad
  {
    id: 'recipe-simple-chickpea-salad',
    title: 'Mediterranean Chickpea Salad',
    servings: 3,
    prep_time: 10,
    cook_time: 0,
    ingredients: [
      { name: 'Cooked Chickpeas', amount: 200, unit: 'g', pantry_item_id: 'prepared-chickpeas' },
      { name: 'Cherry Tomatoes', amount: 100, unit: 'g', pantry_item_id: 'veg-cherry-tomatoes' },
      { name: 'Olive Oil', amount: 30, unit: 'ml', pantry_item_id: 'pantry-olive-oil' },
      { name: 'Za\'atar', amount: 5, unit: 'g', pantry_item_id: 'international-za-atar' },
      { name: 'Sumac', amount: 3, unit: 'g', pantry_item_id: 'international-sumac' },
      { name: 'Salt', amount: 2, unit: 'g', pantry_item_id: 'spice-salt' }
    ],
    instructions: [
      'Halve the cherry tomatoes',
      'Combine chickpeas and tomatoes in a bowl',
      'Mix olive oil, za\'atar, sumac, and salt',
      'Toss chickpeas with dressing',
      'Let sit 10 minutes before serving to meld flavors'
    ],
    tags: ['vegetarian', 'mediterranean', 'healthy', 'no-cook'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // Simple Recipe 5: French Herbed Butter Vegetables
  {
    id: 'recipe-simple-herbed-vegetables',
    title: 'Herbes de Provence Roasted Vegetables',
    servings: 4,
    prep_time: 15,
    cook_time: 35,
    ingredients: [
      { name: 'Eggplant', amount: 250, unit: 'g', pantry_item_id: 'veg-eggplant' },
      { name: 'Roma Tomatoes', amount: 100, unit: 'g', pantry_item_id: 'veg-roma-tomatoes' },
      { name: 'Onions', amount: 1, unit: 'items', pantry_item_id: 'veg-onions' },
      { name: 'Olive Oil', amount: 40, unit: 'ml', pantry_item_id: 'pantry-olive-oil' },
      { name: 'Herbes de Provence', amount: 8, unit: 'g', pantry_item_id: 'french-herbs-provence' },
      { name: 'Garlic', amount: 3, unit: 'cloves', pantry_item_id: 'veg-garlic' }
    ],
    instructions: [
      'Preheat oven to 425°F (220°C)',
      'Cube eggplant, slice onions, quarter tomatoes',
      'Toss vegetables with olive oil, herbs, and minced garlic',
      'Spread on baking sheet, season with salt',
      'Roast 35 minutes until vegetables are tender and golden'
    ],
    tags: ['vegetarian', 'french', 'roasted', 'healthy'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // Simple Recipe 6: Quick Harissa Marinade for Protein
  {
    id: 'recipe-simple-harissa-marinade',
    title: 'Quick Harissa Chicken Marinade',
    servings: 4,
    prep_time: 10,
    cook_time: 20,
    ingredients: [
      { name: 'Chicken Legs/Thighs', amount: 800, unit: 'g', pantry_item_id: 'meat-chicken-legs' },
      { name: 'Harissa Paste', amount: 25, unit: 'g', pantry_item_id: 'international-harissa' },
      { name: 'Plain Yogurt', amount: 100, unit: 'g', pantry_item_id: 'dairy-plain-yogurt' },
      { name: 'Olive Oil', amount: 20, unit: 'ml', pantry_item_id: 'pantry-olive-oil' },
      { name: 'Garlic', amount: 2, unit: 'cloves', pantry_item_id: 'veg-garlic' },
      { name: 'Salt', amount: 5, unit: 'g', pantry_item_id: 'spice-salt' }
    ],
    instructions: [
      'Mix harissa, yogurt, olive oil, minced garlic, and salt',
      'Marinate chicken in mixture for at least 30 minutes',
      'Preheat oven to 400°F (200°C)',
      'Bake chicken 20-25 minutes until cooked through',
      'Serve with rice or vegetables'
    ],
    tags: ['middle-eastern', 'marinated', 'spicy', 'protein'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  },

  // Simple Recipe 7: Quick Miso Soup
  {
    id: 'recipe-simple-miso-soup',
    title: 'Simple White Miso Soup',
    servings: 2,
    prep_time: 5,
    cook_time: 10,
    ingredients: [
      { name: 'White Miso Paste', amount: 30, unit: 'g', pantry_item_id: 'international-miso-paste' },
      { name: 'Firm Tofu', amount: 100, unit: 'g', pantry_item_id: 'protein-tofu' },
      { name: 'Fresh Ginger', amount: 10, unit: 'g', pantry_item_id: 'asian-ginger-fresh' },
      { name: 'Garlic', amount: 1, unit: 'cloves', pantry_item_id: 'veg-garlic' },
      { name: 'Sesame Oil', amount: 5, unit: 'ml', pantry_item_id: 'asian-sesame-oil' }
    ],
    instructions: [
      'Bring 500ml water to simmer with grated ginger and garlic',
      'Simmer 5 minutes, then strain out solids',
      'Whisk miso paste with small amount of hot broth',
      'Add miso mixture back to pot, add cubed tofu',
      'Heat through without boiling, drizzle with sesame oil'
    ],
    tags: ['japanese', 'soup', 'vegetarian', 'quick'],
    created_by: 'simon',
    created_at: new Date().toISOString()
  }
]