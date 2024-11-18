import {expect as expectA11y, test as testA11y} from './fixtures/a11y';

const options = {
  loglevel: 'info'
};

export async function pageTests(url: string, tags: string[]) {
	testA11y.describe('a11y', { tag: [...tags, '@a11y'] }, () => {

		testA11y(`a11y test for ${url}`, async ({ page, makeAxeBuilder }) => {
			await page.goto(url);

			const accessibilityScanResults = await makeAxeBuilder()
				// Automatically uses the shared AxeBuilder configuration,
				// but supports additional test-specific configuration too
				// .include('#specific-element-under-test')
				.analyze();

			expectA11y(accessibilityScanResults.violations).toEqual([]);
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
