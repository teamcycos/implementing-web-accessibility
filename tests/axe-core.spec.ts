import {expect, test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {pageTests} from "./shared-tests";
// @ts-ignore
import URLs from './urls.json';

const aChecker = require('accessibility-checker');
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


      // const accessibilityScanResults = await new AxeBuilder({page}).include('app-price-range-slider').analyze();
      // expect(accessibilityScanResults.violations).toEqual([]);
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

  test.describe('dialog tests equal access', () => {
    const url = 'http://localhost:4201/second-page';
    test.beforeEach(async ({page}) => {
      await page.goto(url);
    });

    test.skip('a11y', async ({page}) => {
      try {
        await page.click('#openDialogButton');
        await page.waitForSelector('dialog[open]');
        const locator = page.getByRole('dialog');
        // console.log(locator);
        const elementHandle = await locator.elementHandle();
         const htmlElement = await elementHandle?.evaluate(el => el);
         elementHandle?.dispose();
        /*const element = await page.evaluateHandle((htmlString) => {
          const template = document.createElement('template');
          template.innerHTML = htmlString.trim();
          return template.content.getElementById('myDialog');
        }, '<button>Click Me</button>');*/// await page.$('dialog[open]') as ElementHandle<HTMLElement>;
       /* const template = document.createElement('template');
        template.innerHTML = element?.trim() || ''; // .trim() prevents empty text nodes
        const htmlElement = template.content.firstElementChild;*7

        */
        console.log('element', htmlElement?.outerHTML);
        const {report} = await aChecker.getCompliance(
          htmlElement,
          'first-page'
        ) as { report?: { results?: Array<{ message?: string; level?: string } & Record<string, unknown>> } };
       // const reportResults = report?.results ?? [];
        // console.log('Accessibility Report:', reportResults.filter(r => r.level !== 'pass'));
        // console.log('result', aChecker.stringifyResults(report));
        console.log(aChecker.getBaseline('first-page'));
        expect(aChecker.assertCompliance(report ?? {results: []})).toBe(0);
      } finally {
        await aChecker.close();
      }
    });
  });
});
