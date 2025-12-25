import {expect, test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {pageTests} from "./shared-tests";
// @ts-ignore
import URLs from './urls.json';

pageTests('http://localhost:4201/first-page', ['@pag1']);
pageTests('http://localhost:4201/second-page', ['@pag2']);
test.describe('Should not find accessibility issues', () => {
  /* test.describe('the whole page of', () => {

    for (let url of URLs.URLs) {
      test(`${url}`, async ({page}) => {
        await page.goto(url);
        const accessibilityScanResults = await new AxeBuilder({page}).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
      });
    }
*/
    test.describe('slider tests', () => {
      test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:4201/first-page');
      });

      test('slider value change', async ({page}) => {
        const slider = page.getByRole('slider');
        // There are 4 items available
        expect(await page.getAttribute('[aria-live="polite"]', 'aria-label')).toBe('There are 4 items available');
        slider.focus();
        slider.fill('140');
        expect(slider).toHaveRole('slider');
        // There are 3 items available
        await page.waitForSelector('[aria-live="polite"]');
        expect(await page.getAttribute('[aria-live="polite"]', 'aria-label')).toBe('There are 3 items available');


        const accessibilityScanResults = await new AxeBuilder({page}).include('app-price-range-slider').analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });

    test.describe('dialog tests', () => {
      test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:4201/first-page');
      });

      test('open dialog and run a11y check', async ({page}) => {
        await page.click('#openDialogButton');
        await page.waitForSelector('dialog[open]');
        const accessibilityScanResults = await new AxeBuilder({page}).include('#myDialog').analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
        let locator = page.getByText('Close Dialog');
        await expect(locator).toBeFocused();
        expect(locator).toHaveRole('button');
        expect(locator).toHaveAccessibleName('Close Dialog');
        await page.click('#closeDialogButton');
        locator = page.getByText('Open Dialog');
        await expect(locator).toBeFocused();
      });
    });
//  });
});
