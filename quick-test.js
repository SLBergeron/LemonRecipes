const { chromium } = require('@playwright/test');

async function quickTest() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Testing http://localhost:5173/LemonRecipes/');
    await page.goto('http://localhost:5173/LemonRecipes/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    const title = await page.title();
    console.log('Page title:', title);
    
    const header = await page.textContent('h1').catch(() => 'Not found');
    console.log('Main header:', header);
    
    if (header === 'Oops! Something went wrong') {
      console.log('STILL SHOWING ERROR BOUNDARY');
    } else {
      console.log('SUCCESS! App is working');
      
      // Try to find navigation buttons
      const pantryBtn = await page.locator('text=Pantry').count();
      const recipeBtn = await page.locator('text=Recipes').count();
      console.log('Navigation buttons found - Pantry:', pantryBtn, 'Recipes:', recipeBtn);
    }
    
    await page.screenshot({ path: 'working-test.png' });
    console.log('Screenshot saved');
    
    await page.waitForTimeout(5000); // Keep open for a moment
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

quickTest();