#!/usr/bin/env node
/**
 * Script to convert sample recipes from TypeScript to individual JSON files
 */
const fs = require('fs').promises;
const path = require('path');

// Import the sample recipes (we'll eval the TypeScript file content)
const sampleRecipesPath = path.join(__dirname, '../src/data/sample-recipes.ts');
const recipesDir = path.join(__dirname, '../src/data/recipes');

async function convertRecipesToJSON() {
  try {
    console.log('🔄 Converting recipes to individual JSON files...');
    
    // Read the sample-recipes.ts file
    const content = await fs.readFile(sampleRecipesPath, 'utf8');
    
    // Extract the array of recipes - this is a simple approach
    const recipeArrayMatch = content.match(/export const sampleRecipes.*?= \[([\s\S]*)\]/);
    if (!recipeArrayMatch) {
      throw new Error('Could not find sampleRecipes array in file');
    }
    
    // Create recipes directory if it doesn't exist
    await fs.mkdir(recipesDir, { recursive: true });
    
    // Load and evaluate the TypeScript module
    const { execSync } = require('child_process');
    
    // Use ts-node to evaluate the recipes
    const tsNodeCommand = `cd ${path.dirname(sampleRecipesPath)} && npx ts-node -e "
      import('./sample-recipes.ts').then(module => {
        console.log(JSON.stringify(module.sampleRecipes, null, 2));
      }).catch(console.error);
    "`;
    
    console.log('📝 Executing ts-node to load recipes...');
    const recipesJson = execSync(tsNodeCommand, { encoding: 'utf8', cwd: path.join(__dirname, '..') });
    const recipes = JSON.parse(recipesJson);
    
    console.log(`📊 Found ${recipes.length} recipes to convert`);
    
    // Convert each recipe to an individual JSON file
    let convertedCount = 0;
    for (const recipe of recipes) {
      if (!recipe.id) {
        console.warn(`⚠️  Skipping recipe without ID: ${recipe.title || 'Unknown'}`);
        continue;
      }
      
      // Create clean filename from recipe ID
      const filename = `${recipe.id}.json`;
      const filepath = path.join(recipesDir, filename);
      
      // Write individual recipe JSON file
      await fs.writeFile(filepath, JSON.stringify(recipe, null, 2), 'utf8');
      convertedCount++;
      
      if (convertedCount % 20 === 0) {
        console.log(`✅ Converted ${convertedCount} recipes...`);
      }
    }
    
    console.log(`🎉 Successfully converted ${convertedCount} recipes to individual JSON files!`);
    console.log(`📁 Files created in: ${recipesDir}`);
    
  } catch (error) {
    console.error('❌ Error converting recipes:', error.message);
    process.exit(1);
  }
}

// Run the conversion
convertRecipesToJSON();