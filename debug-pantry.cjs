const { chromium } = require('@playwright/test');

async function debugPantry() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Testing live site: https://slbergeron.github.io/LemonRecipes/');
    await page.goto('https://slbergeron.github.io/LemonRecipes/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for React to render
    await page.waitForTimeout(3000);
    
    // Check if pantry tab exists and click it
    const pantryButton = await page.locator('button:has-text("Pantry")').first();
    if (await pantryButton.isVisible()) {
      console.log('✅ Pantry button found, clicking...');
      await pantryButton.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('❌ Pantry button not found');
    }
    
    // Check for pantry inventory elements
    const inventoryHeader = await page.textContent('h2:has-text("Pantry Inventory")').catch(() => null);
    console.log('Pantry Inventory header:', inventoryHeader);
    
    // Check for statistics
    const totalItems = await page.textContent('text=Total Items').catch(() => null);
    console.log('Total Items stat:', totalItems);
    
    // Check for "Add Item" button
    const addButton = await page.textContent('button:has-text("Add Item")').catch(() => null);
    console.log('Add Item button:', addButton);
    
    // Check for category filter
    const categorySelect = await page.textContent('text=All Categories').catch(() => null);
    console.log('Category filter:', categorySelect);
    
    // Check for any pantry items in the list
    const itemCards = await page.locator('[class*="border"][class*="rounded"]').count();
    console.log('Item cards found:', itemCards);
    
    // Look for "No items" message
    const noItemsMsg = await page.textContent('text=No items in this category').catch(() => null);
    console.log('No items message:', noItemsMsg);
    
    // Check console errors
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(`ERROR: ${msg.text()}`);
      }
    });
    
    await page.waitForTimeout(1000);
    console.log('Console errors:', logs);
    
    // Take screenshot
    await page.screenshot({ path: 'pantry-debug.png', fullPage: true });
    console.log('Screenshot saved as pantry-debug.png');
    
    // Check localStorage for pantry data
    const localStorageData = await page.evaluate(() => {
      return localStorage.getItem('simple-pantry');
    });
    console.log('localStorage pantry data:', localStorageData ? 'EXISTS' : 'MISSING');
    
  } catch (error) {
    console.error('Error debugging pantry:', error);
  } finally {
    await browser.close();
  }
}

debugPantry();