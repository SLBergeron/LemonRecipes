const { chromium } = require('@playwright/test');

async function debugPage() {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  // Capture console messages
  const logs = [];
  page.on('console', msg => {
    logs.push(`${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    console.error('PAGE ERROR:', error.message);
    console.error(error.stack);
  });
  
  try {
    console.log('Navigating to http://localhost:5173/LemonRecipes/');
    await page.goto('http://localhost:5173/LemonRecipes/', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    // Wait a moment for React to render
    await page.waitForTimeout(3000);
    
    // Check if we're in error state
    const errorTitle = await page.textContent('h1').catch(() => null);
    console.log('Main header:', errorTitle);
    
    if (errorTitle === 'Oops! Something went wrong') {
      console.log('ERROR BOUNDARY TRIGGERED!');
      
      // Look for error details
      const detailsButton = await page.locator('summary:has-text("Error Details")').first();
      if (await detailsButton.count() > 0) {
        console.log('Found error details, clicking...');
        await detailsButton.click();
        await page.waitForTimeout(500);
        
        const errorDetails = await page.textContent('pre').catch(() => 'Could not get error details');
        console.log('ERROR DETAILS:');
        console.log(errorDetails);
      }
    }
    
    // Print all console messages
    console.log('\n=== CONSOLE MESSAGES ===');
    logs.forEach(log => console.log(log));
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    console.log('Screenshot saved as debug-screenshot.png');
    
    // Keep browser open for manual debugging
    console.log('Browser staying open for manual debugging...');
    await page.waitForTimeout(30000); // Keep open for 30 seconds
    
  } catch (error) {
    console.error('Error debugging page:', error);
  } finally {
    await browser.close();
  }
}

debugPage();