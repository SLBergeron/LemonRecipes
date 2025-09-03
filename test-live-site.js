const { chromium } = require('@playwright/test');

async function testLiveSite() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Testing live site: https://slbergeron.github.io/LemonRecipes/');
    await page.goto('https://slbergeron.github.io/LemonRecipes/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for React to render
    await page.waitForTimeout(3000);
    
    // Check page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Look for the new smart pantry navigation
    const pantryButton = await page.textContent('button:has-text("Pantry")').catch(() => null);
    const recipesButton = await page.textContent('button:has-text("Recipes")').catch(() => null);
    const weekButton = await page.textContent('button:has-text("This Week")').catch(() => null);
    const shoppingButton = await page.textContent('button:has-text("Shopping")').catch(() => null);
    
    console.log('New Navigation Found:');
    console.log('- Pantry button:', pantryButton);
    console.log('- Recipes button:', recipesButton);
    console.log('- This Week button:', weekButton);
    console.log('- Shopping button:', shoppingButton);
    
    // Check for old navigation elements (should NOT be present)
    const oldMealPlan = await page.textContent('button:has-text("Meal Plan")').catch(() => null);
    const oldGroceryList = await page.textContent('button:has-text("Grocery List")').catch(() => null);
    const oldTimeline = await page.textContent('button:has-text("Timeline")').catch(() => null);
    
    console.log('Old Navigation (should be null):');
    console.log('- Old Meal Plan:', oldMealPlan);
    console.log('- Old Grocery List:', oldGroceryList);
    console.log('- Old Timeline:', oldTimeline);
    
    // Check main header
    const header = await page.textContent('h1').catch(() => null);
    console.log('Main header:', header);
    
    // Check for "Pantry Inventory" text (should be visible by default)
    const pantryInventory = await page.textContent('h2:has-text("Pantry Inventory")').catch(() => null);
    console.log('Pantry Inventory header:', pantryInventory);
    
    // Take screenshot
    await page.screenshot({ path: 'live-site-test.png', fullPage: true });
    console.log('Screenshot saved as live-site-test.png');
    
    // Determine if deployment is successful
    if (pantryButton && recipesButton && weekButton && shoppingButton && !oldMealPlan) {
      console.log('✅ SUCCESS: New smart pantry system is deployed!');
    } else {
      console.log('❌ ISSUE: Old version or deployment problem detected');
    }
    
  } catch (error) {
    console.error('Error testing live site:', error);
  } finally {
    await browser.close();
  }
}

testLiveSite();