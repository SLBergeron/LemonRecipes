const { chromium } = require('@playwright/test');

async function testPage() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to http://localhost:5173/LemonRecipes/');
    await page.goto('http://localhost:5173/LemonRecipes/', { waitUntil: 'domcontentloaded' });
    
    // Wait a moment for React to render
    await page.waitForTimeout(2000);
    
    // Check if the main app loaded
    const title = await page.title();
    console.log('Page title:', title);
    
    // Look for key elements
    const header = await page.textContent('h1');
    console.log('Main header:', header);
    
    // Check for navigation buttons
    const pantryButton = await page.textContent('button:has-text("Pantry")');
    console.log('Pantry button found:', pantryButton);
    
    // Take a screenshot to see what's rendering
    await page.screenshot({ path: 'page-screenshot.png', fullPage: true });
    console.log('Screenshot saved as page-screenshot.png');
    
    // Check for any errors in console
    const logs = [];
    page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`));
    
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    
    console.log('Console messages:', logs);
    
  } catch (error) {
    console.error('Error testing page:', error);
  } finally {
    await browser.close();
  }
}

testPage();