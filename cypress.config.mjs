import { defineConfig } from "cypress";
// Load ACE configuration for rule ignores
// import aceConfig from './aceconfig.js';

export default defineConfig({
  e2e: {
    defaultBrowser: "chrome",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      // Ensure tooling that auto-loads config files resolves from the repository root.
      process.chdir(config.projectRoot);

      on("before:browser:launch", (browser, launchOptions) => {
        // Dev containers often run as root; Chromium requires sandbox to be disabled.
        if (browser.family === "chromium") {
          launchOptions.args.push("--no-sandbox");
          launchOptions.args.push("--disable-setuid-sandbox");
        }

        return launchOptions;
      });

      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
        error(message) {
          console.log("\x1b[31m%s\x1b[0m", message);
          return null;
        },
        info(message) {
          console.log("\x1b[33m%s\x1b[0m", message);
          return null;
        },

        table(data) {
          console.table(data);
          return null;
        },

        /**
         * Runs IBM Equal Access accessibility-checker in Node (not in the browser bundle).
         * @param {{ html: string, label: string, outputDir?: string }} input
         */
        async equalAccessGetCompliance(input) {
          const { html, label } = input || {};

          console.log("html input / URL", html);
          if (!html || !label) {
            throw new Error(
              `equalAccessGetCompliance requires html and label (got html=${Boolean(html)}, label=${Boolean(label)})`,
            );
          }

          const aChecker = await import("accessibility-checker");
          try {
            // Some versions of accessibility-checker treat the first parameter as a URL.
            // When we pass raw HTML, ensure we also pass a base URL so relative URLs resolve
            // and the checker doesn't attempt to navigate to the HTML string.

            // Clean the label to ensure it's safe for the reporter
            const safeLabel = label.replace(/[^a-z0-9-_]+/gi, "_");

            let report = {};
            // Prefer the explicit HTML API shape if supported.
            if (typeof aChecker.getCompliance === "function") {
              // Use the label in all API calls
              try {
                // Try passing label as second parameter (most common signature)
                const checkerConfig = await aChecker.getConfig();
                console.log("aChecker config cwd:", process.cwd());
                console.log("aChecker puppeteerArgs:", checkerConfig?.puppeteerArgs || []);
                const result = await aChecker.getCompliance(html, safeLabel);
                report = result?.report || {};
                console.log(report);
              } catch (e) {
                console.error(
                  "getCompliance with label failed, trying with baseUrl:",
                  e.message,
                );
                throw e;
              }
            }

            const reportCode = aChecker.assertCompliance(report);

            console.log("report code: ", reportCode);
            return { report, reportCode };
          } finally {
            await aChecker.close();
          }
        },
      });

      return config;
    },
  },

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
    supportFile: "cypress/support/component.ts",
  },
});
