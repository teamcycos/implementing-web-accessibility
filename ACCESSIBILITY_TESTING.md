# Accessibility Testing Configuration

## Übersicht

Dieses Projekt verwendet IBM Equal Access Accessibility Checker für automatisierte Accessibility-Tests in Playwright und Cypress.

## Konfigurationsdateien

### 1. `.achecker.yml`
Diese Datei wird **nur vom CLI-Tool** (`npx achecker`) verwendet und **nicht** von der Node.js API.

```bash
# CLI-Verwendung (lädt .achecker.yml automatisch)
npx achecker http://localhost:4201
```

### 2. `aceconfig.js`
Diese Datei enthält die Konfiguration für die **Node.js API** und wird in den Playwright- und Cypress-Tests verwendet.

```javascript
module.exports = {
    ignore: ['style_highcontrast_visible', 'style_color_misuse', 'text_block_heading']
    // ... weitere Konfiguration
};
```

## Ignorieren von Regeln

### Warum manuelle Filterung notwendig ist

Die IBM accessibility-checker Bibliothek lädt `.achecker.yml` **nicht automatisch**, wenn Sie die Node.js API verwenden (`require('accessibility-checker')`). Außerdem ignoriert `aChecker.getCompliance()` die `ignore`-Regeln aus der Konfiguration nicht automatisch.

### Implementierung in den Tests

#### Playwright Tests (`tests/shared-tests.ts`)
```typescript
const aceConfig = require(path.resolve(__dirname, '..', 'aceconfig.js'));

// Nach dem Scan: Markiere ignorierte Regeln
if (report?.results && aceConfig.ignore) {
  report.results = report.results.map((result: any) => {
    if (aceConfig.ignore.includes(result.ruleId)) {
      return { ...result, ignored: true };
    }
    return result;
  });
}

// Zähle nur nicht-ignorierte Failures
const failLevels = ['violation', 'potentialviolation'];
const failures = reportResults.filter(
  (r: any) => !r.ignored && failLevels.includes(r.level)
);
```

#### Cypress Tests (`cypress.config.js`)
```javascript
const aceConfig = require(path.resolve(__dirname, 'aceconfig.js'));

// Im equalAccessGetCompliance Task
if (report?.results && aceConfig.ignore) {
  report.results = report.results.map((result) => {
    if (aceConfig.ignore.includes(result.ruleId)) {
      return { ...result, ignored: true };
    }
    return result;
  });
}

// Berechne reportCode basierend auf nicht-ignorierten Failures
const failLevels = ['violation', 'potentialviolation'];
const failures = reportResults.filter(
  (r) => !r.ignored && failLevels.includes(r.level)
);
const reportCode = failures.length > 0 ? 2 : 0;
```

## Aktuell ignorierte Regeln

Die folgenden Regeln werden in den Tests ignoriert:

1. **style_highcontrast_visible** - Manueller Test erforderlich für Windows High Contrast Mode
2. **style_color_misuse** - Potentielle Verletzung bzgl. Farbverwendung
3. **text_block_heading** - Potentielle Verletzung bei Preisangaben, die fälschlicherweise als Überschriften erkannt werden

## Tests ausführen

```bash
# Playwright Accessibility Tests
npm run test:a11y

# Cypress E2E Accessibility Tests
npm run cypress:run:e2e

# Alle Tests
npm test
```

## Neue Regeln ignorieren

1. Füge die Regel zu `aceconfig.js` im `ignore` Array hinzu
2. Füge die Regel zu `.achecker.yml` im `ignore` Array hinzu (für CLI-Verwendung)
3. Die Tests werden die Regel automatisch ignorieren

Beispiel:
```javascript
// aceconfig.js
ignore: [
  'style_highcontrast_visible',
  'style_color_misuse',
  'text_block_heading',
  'neue_regel_hier' // Neue Regel hinzufügen
]
```

```yaml
# .achecker.yml
ignore:
  - style_highcontrast_visible
  - style_color_misuse
  - text_block_heading
  - neue_regel_hier  # Neue Regel hinzufügen
```
