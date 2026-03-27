import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.new_page();

  // Desktop
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:4321');
  await page.screenshot({ path: 'hero_desktop_large_font.png' });

  // Mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:4321');
  await page.screenshot({ path: 'hero_mobile_large_font.png' });

  await browser.close();
})();
