import {expect as expectA11y, test as testA11y} from './fixtures/a11y';

import {expect} from "@playwright/test";

const aChecker = require('accessibility-checker');
const path = require('path');

// Load configuration from aceconfig.js
const aceConfig = require(path.resolve(__dirname, '..', 'aceconfig.js'));

export async function pageTests(url: string, tags: string[]) {
  testA11y.describe('a11y', {tag: [...tags, '@a11y']}, () => {
    testA11y(`a11y test for ${url}`, async ({page, makeAxeBuilder}) => {
      await page.goto(url);

      const accessibilityScanResults = await makeAxeBuilder()
        // Automatically uses the shared AxeBuilder configuration,
        // but supports additional test-specific configuration too
        // .include('#specific-element-under-test')
        .analyze();

      expectA11y(accessibilityScanResults.violations).toEqual([]);
    });

    testA11y('equal accessibility-checker test for ' + url, async () => {
      try {

        const {report} = (await aChecker.getCompliance(
         url,
          url
        )) as { report?: { results?: Array<{ message?: string; level?: string; ruleId?: string; ignored?: boolean } & Record<string, unknown>> } };
        console.log('Results counts: ', report?.summary?.counts );

        // Filter out ignored rules
        if (report?.results && aceConfig.ignore) {
          report.results = report.results.map((result: any) => {
            if (aceConfig.ignore.includes(result.ruleId)) {
              console.log(`Ignoring rule: ${result.ruleId}`);
              return { ...result, ignored: true };
            }
            return result;
          });
        }


        const reportResults = report?.results ?? [];
        console.log('Accessibility Report:', reportResults.filter(r => r.level !== 'pass'));

        // Count only non-ignored violations and potential violations
        const failLevels = ['violation', 'potentialviolation'];
        const failures = reportResults.filter(
          (r: any) => !r.ignored && failLevels.includes(r.level)
        );
        console.log(failures[0]);
        // expect(failures.length).toBe(0); // Assert no non-ignored violations or potential violations
        // To assert using aChecker, use:
        expect(aChecker.assertCompliance(report)).toBe(0);
      } finally {
        await aChecker.close();
      }
    });
  });

  /*test(`Lighthouse test for ${url}`, async () => {
    // Info: playwright-lighthouse only supports chromium.
    const browser = await playwright['chromium'].launch({
      args: ['--remote-debugging-port=9222'],
      headless: true
    });

    const page = await browser.newPage();
    await page.goto(url);
    await playAudit({
      page: page,
      thresholds: thresholds,
      port: 9222,
      reports: {
        formats: {
          html: true //defaults to false
        },
        name: `lighthouse-${url
          .split('//')[1]
          .replaceAll('/', '-')
          .replaceAll(':', '-')
          .replaceAll('?', '-')
          .replaceAll('=', '-')
          .replaceAll('.', '-')}`, //defaults to `lighthouse-${new Date().getTime()}`
        directory: `./reports/lighthouse` //defaults to `${process.cwd()}/lighthouse`
      }
    });
    await page.close();
    await browser.close();
  });*7
/*
	lighthouseTest.describe('a11y', { tag: [...tags, '@a11y'] }, () => {

		lighthouseTest(`lighthouse tests of ${url}`, async ({ page, port }) => {
			await page.goto(url);

			// Dynamischer Import von playAudit
			const { playAudit } = await import('playwright-lighthouse');
			await playAudit({
				page,
				thresholds: thresholds,
				port,
			});
		});
	});
*/
}
