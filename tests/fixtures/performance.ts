import { test as base } from "@playwright/test";
import type { Browser } from "playwright";
import { chromium } from "playwright";

export const lighthouseTest = base.extend<object, { port: number; browser: Browser }>({
	port: [
		// biome-ignore lint/correctness/noEmptyPattern: Required by lighthouseTest
		async ({}, use) => {
			const port = 4201;
			await use(port);
		},
		{ scope: "worker" },
	],

	browser: [
		async ({ port }, use) => {
			const browser = await chromium.launch({
				args: [`--remote-debugging-port=${port}`],
			});
			await use(browser);
		},
		{ scope: "worker" },
	],
});

export const thresholds = {
	performance: 55,
	accessibility: 95,
	"best-practices": 90,
	pwa: 100,
};
