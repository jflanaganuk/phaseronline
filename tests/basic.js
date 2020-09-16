const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();

  // Go to http://localhost:9090/
  await page.goto('http://localhost:9090/');

  // Click //canvas
  await page.click('//canvas');

  await page.keyboard.press('D', {delay: 2600});
  await page.keyboard.press('S', {delay: 1800});
  await page.keyboard.press('A', {delay: 2600});
  await page.keyboard.press('W', {delay: 1800});

  // Close page
  await page.close();
  await browser.close();
})();
