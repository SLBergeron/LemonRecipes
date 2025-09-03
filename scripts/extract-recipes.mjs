#!/usr/bin/env node
/**
 * Script to extract recipes from sample-recipes.ts and create individual JSON files
 */
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sampleRecipesPath = path.join(__dirname, '../src/data/sample-recipes.ts');
const recipesDir = path.join(__dirname, '../src/data/recipes');

async function extractRecipes() {
  try {
    console.log('🔄 Extracting recipes from sample-recipes.ts...');
    
    // Read the sample-recipes.ts file
    const content = await readFile(sampleRecipesPath, 'utf8');
    
    // Create recipes directory if it doesn't exist
    if (!existsSync(recipesDir)) {
      await mkdir(recipesDir, { recursive: true });
    }
    
    // Simple regex to extract each recipe object
    const recipeMatches = content.match(/\{\s*id:\s*'[^']+',[\s\S]*?\}/g);
    
    if (!recipeMatches) {
      throw new Error('Could not find recipe objects in file');
    }
    
    console.log(`📊 Found ${recipeMatches.length} recipe objects to process`);
    
    let convertedCount = 0;
    
    for (let i = 0; i < recipeMatches.length; i++) {
      const recipeText = recipeMatches[i];
      
      // Extract the recipe ID
      const idMatch = recipeText.match(/id:\s*'([^']+)'/);
      if (!idMatch) {
        console.warn(`⚠️  Skipping recipe without valid ID at index ${i}`);
        continue;
      }
      
      const recipeId = idMatch[1];
      const filename = `${recipeId}.json`;
      
      try {
        // Convert the JavaScript object text to JSON
        // We need to properly parse this - let's try a different approach
        
        // Replace JavaScript syntax with JSON syntax
        let jsonText = recipeText
          // Replace single quotes with double quotes for strings
          .replace(/'([^']*)':/g, '"$1":')  // property names
          .replace(/:\s*'([^']*)'/g, ': "$1"')  // string values
          // Handle arrays and nested objects
          .replace(/new Date\(\)\.toISOString\(\)/g, `"${new Date().toISOString()}"`)
          // Fix trailing commas
          .replace(/,(\s*})/g, '$1')
          .replace(/,(\s*])/g, '$1');
        
        // Try to parse as JSON
        const recipe = JSON.parse(jsonText);
        
        // Write individual recipe JSON file
        const filepath = path.join(recipesDir, filename);
        await writeFile(filepath, JSON.stringify(recipe, null, 2), 'utf8');
        convertedCount++;
        
        if (convertedCount % 20 === 0) {
          console.log(`✅ Converted ${convertedCount} recipes...`);
        }
        
      } catch (error) {
        console.warn(`⚠️  Failed to convert recipe ${recipeId}: ${error.message}`);
      }
    }
    
    console.log(`🎉 Successfully converted ${convertedCount} recipes to individual JSON files!`);
    console.log(`📁 Files created in: ${recipesDir}`);
    
  } catch (error) {
    console.error('❌ Error extracting recipes:', error);
    process.exit(1);
  }
}

// Run the extraction
extractRecipes();