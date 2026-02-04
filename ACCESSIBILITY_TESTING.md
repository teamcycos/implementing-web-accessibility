# Accessibility Testing Configuration

## Overview

This project uses the IBM Equal Access Accessibility Checker for automated accessibility testing in Playwright and Cypress.

## Configuration Files

### 1. `.achecker.yml`
This file is **only used by the CLI tool** (`npx achecker`) and **not** by the Node.js API.

```bash
# CLI usage (automatically loads .achecker.yml)
npx achecker http://localhost:4201
```

### 2. `aceconfig.js`
This file contains the configuration for the **Node.js API** and is used in Playwright and Cypress tests.

```javascript
module.exports = {
    ignore: ['style_highcontrast_visible', 'style_color_misuse', 'text_block_heading']
    // ... additional configuration
};
```

## Ignoring Rules

### Why manual filtering is necessary

The IBM accessibility-checker library does not automatically load `.achecker.yml` when you use the Node.js API (`require('accessibility-checker')`). Also, `aChecker.getCompliance()` does not automatically ignore the `ignore` rules from the configuration.

### Implementation in the tests

#### Playwright Tests (`tests/shared-tests.ts`)
```typescript
const aceConfig = require(path.resolve(__dirname, '..', 'aceconfig.js'));

// After scanning: Mark ignored rules
if (report?.results && aceConfig.ignore) {
  report.results = report.results.map((result: any) => {
    if (aceConfig.ignore.includes(result.ruleId)) {
      return { ...result, ignored: true };
    }
    return result;
  });
}

// Count only non-ignored failures
const failLevels = ['violation', 'potentialviolation'];
const failures = reportResults.filter(
  (r: any) => !r.ignored && failLevels.includes(r.level)
);
```

#### Cypress Tests (`cypress.config.js`)
```javascript
const aceConfig = require(path.resolve(__dirname, 'aceconfig.js'));

// In the equalAccessGetCompliance task
if (report?.results && aceConfig.ignore) {
  report.results = report.results.map((result) => {
    if (aceConfig.ignore.includes(result.ruleId)) {
      return { ...result, ignored: true };
    }
    return result;
  });
}

// Calculate reportCode based on non-ignored failures
const failLevels = ['violation', 'potentialviolation'];
const failures = reportResults.filter(
  (r) => !r.ignored && failLevels.includes(r.level)
);
const reportCode = failures.length > 0 ? 2 : 0;
```

## Currently Ignored Rules

The following rules are ignored in the tests:

1. **style_highcontrast_visible** - Manual test required for Windows High Contrast Mode
2. **style_color_misuse** - Potential violation regarding color usage
3. **text_block_heading** - Potential violation with price indications incorrectly recognized as headings

## Running Tests

```bash
# Playwright Accessibility Tests
npm run test:a11y

# Cypress E2E Accessibility Tests
npm run cypress:run:e2e

# All tests
npm test
```

## Ignoring New Rules

1. Add the rule to the `ignore` array in `aceconfig.js`
2. Add the rule to the `ignore` array in `.achecker.yml` (for CLI usage)
3. The tests will automatically ignore the rule

Example:
```javascript
// aceconfig.js
ignore: [
  'style_highcontrast_visible',
  'style_color_misuse',
  'text_block_heading',
  'new_rule_here' // Add new rule here
]
```

```yaml
# .achecker.yml
ignore:
  - style_highcontrast_visible
  - style_color_misuse
  - text_block_heading
  - new_rule_here  # Add new rule here
```
