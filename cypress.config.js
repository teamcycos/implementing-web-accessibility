const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
// Load ACE configuration for rule ignores
// const aceConfig = require(path.resolve(__dirname, 'aceconfig.js'));

module.exports = defineConfig({
  e2e: {
    defaultBrowser: "chrome",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      on("task", {
        log(message) {
          if(message) {
            console.log(message);
            return null;
          }
          console.log(message);
          return null;
        },
        error(message) {
          console.log('\x1b[31m%s\x1b[0m', message);
          return null;
        },
        info(message) {
          console.log('\x1b[33m%s\x1b[0m', message);
          return null;
        },

        table(data) {
          console.table(data);
          return null;
        },

        /**
         * Runs IBM Equal Access accessibility-checker in Node (not in the browser bundle).
         * @param {{ html: string, label: string, baseUrl?: string, outputDir?: string }} input
         */
        async equalAccessGetCompliance(input) {
          const { html, label, baseUrl, outputDir = "test-results/equal-access" } = input || {};

          console.log('html input / URL', html);
          if (!html || !label) {
            throw new Error(
              `equalAccessGetCompliance requires html and label (got html=${Boolean(html)}, label=${Boolean(label)})`
            );
          }

          const aChecker = require('accessibility-checker');
          try {
            // Some versions of accessibility-checker treat the first parameter as a URL.
            // When we pass raw HTML, ensure we also pass a base URL so relative URLs resolve
            // and the checker doesn't attempt to navigate to the HTML string.

            // Clean the label to ensure it's safe for the reporter
            const safeLabel = label.replace(/[^a-z0-9-_]+/gi, "_");

            let report = {};
            // Prefer the explicit HTML API shape if supported.
            if (typeof aChecker.getCompliance === 'function') {
              // Use the label in all API calls
              try {
                // Try passing label as second parameter (most common signature)
                const result = await aChecker.getCompliance(html, safeLabel);
                report = result?.report || {};
                // Filter out ignored rules
                /*
                if (report?.results && aceConfig.ignore) {
                  report.results = report.results.map((result) => {
                    if (aceConfig.ignore.includes(result.ruleId)) {
                      return { ...result, ignored: true };
                    }
                    return result;
                  });
                }
                */
                console.log(report);
              } catch (e) {
                console.error('getCompliance with label failed, trying with baseUrl:', e.message);
              }
            }

            // Persist the full report for later inspection.
            let filePath;
            try {
              const outDir = path.resolve(process.cwd(), outputDir);
              fs.mkdirSync(outDir, { recursive: true });
              filePath = path.join(outDir, `${safeLabel}.json`);
              fs.writeFileSync(filePath, JSON.stringify(report ?? {}, null, 2), "utf-8");
            } catch (writeErr) {
              console.warn("Failed to write Equal Access report:", writeErr);
            }

            // Count only non-ignored violations and potential violations
            /*
            const failLevels = ['violation', 'potentialviolation'];
            const reportResults = report?.results || [];
            const failures = reportResults.filter(
              (r) => !r.ignored && failLevels.includes(r.level)
            );*/
            // const reportCode = failures.length > 0 ? 2 : 0;
            const reportCode = aChecker.assertCompliance(report);

            console.log('report code: ', reportCode);
            return { report, filePath, reportCode };
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
