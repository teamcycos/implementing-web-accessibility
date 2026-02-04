/// <reference types="cypress" />

import {injectAxe} from "cypress-axe";
import {Result} from "axe-core";

// Type of equalAccessGetCompliance result
interface EqualAccessCounts {
  elements?: number;
  elementsViolation?: number;
  elementsViolationReview?: number;
  ignored?: number;
  manual?: number;
  pass?: number;
  potentialrecommendation?: number;
  potentialviolation?: number;
  recommendation?: number;
  violation?: number;
}

interface EqualAccessReportResult {
  value?: string;
  level?: string;
  ruleId?: string;
  id?: string;
  rule?: string;
  message?: string;
  reason?: string;
  snippet?: unknown;
}

interface EqualAccessReport {
  summary?: {
    counts?: EqualAccessCounts;
    totalTests?: number;
  };
  results?: EqualAccessReportResult[];
}

interface EqualAccessGetComplianceResult {
  filePath?: string;
  report?: EqualAccessReport;
}

function terminalLog(violations: Result[]) {
 // cy.task('log', 'Violations:');
  console.log('Violations: ', violations);
}

describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4201');
    injectAxe();

  })

  it('Let user know how many available items are', () => {
    // cy.get('input').should('have.attr', 'role', 'slider').should('be.visible');

      const slider = cy.get('input[type=range]');
      // There are 4 items available

      slider
        .should('have.attr', 'aria-valuenow', 150)
        .trigger('focus')
        //.invoke('val', 140)
        //.trigger('change')
        .type('{leftArrow}');
      cy.wait(2000);

      cy.get('[aria-live="polite"]').should('have.attr', 'aria-label', 'There are 4 items available')
      // .should('have.attr', 'aria-valuenow', 140)


    cy.checkA11y(undefined, undefined, terminalLog);

  });

  it('generates a compliance report and asserts', () => {
    const url = 'http://localhost:4201/';
    cy.visit('http://localhost:4201/');
    cy.document().then(() => {

      const label = `cypress15/${encodeURIComponent(url)}/${Date.now()}`;
      cy.task('log', `Assessing (Equal Access) ${url}`);

      // Important: `cy.task(...)` does not use the generic type `Chainable<unknown>`.
      // Therefore, set the return type here instead of hard-typing the `.then(...)` parameter.
      cy.task<EqualAccessGetComplianceResult>('equalAccessGetCompliance', { html: 'http://localhost:4201/', label }).then((result) => {
        const reportData = result?.report || {};
        const counts = reportData?.summary?.counts || {};
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error: Task returns extended object with reportCode property not in EqualAccessGetComplianceResult type
        const reportCode = result.reportCode;
        cy.task('log', `Assessing (Equal Access) ${url} completed with code: ${reportCode}`);
        cy.task('log', `Report saved: ${result?.filePath || 'not saved'}`);
        expect(reportCode).to.equal(0);
        // Summaries
        const summaryTable = [
          { metric: 'Elements', value: counts.elements || 0 },
          { metric: 'Violations', value: counts.violation || 0 },
          { metric: 'Elements Violation', value: counts.elementsViolation || 0 },
          { metric: 'Elements Violation Review', value: counts.elementsViolationReview || 0 },
          { metric: 'Potential Violation', value: counts.potentialviolation || 0 },
          { metric: 'Potential Recommendation', value: counts.potentialrecommendation || 0 },
          { metric: 'Recommendation', value: counts.recommendation || 0 },
          { metric: 'Manual', value: counts.manual || 0 },
          { metric: 'Pass', value: counts.pass || 0 },
          { metric: 'Ignored', value: counts.ignored || 0 },
          { metric: 'Total Tests', value: reportData?.summary?.totalTests || 0 },
        ];

        cy.task('table', summaryTable);

        // Top violation snippets (first 5)
        const topViolations = (reportData.results || [])
          .filter((r) => `${r?.value}`.toUpperCase().includes('VIOLATION'))
          .map((r, idx: number) => ({
            idx: idx + 1,
            rule: r.ruleId || r.id || r.rule || 'unknown',
            level: r.level || r.value,
            message: r.message || r.reason || 'n/a',
            snippet: (r.snippet || '').toString().slice(0, 120),
          }));

        const failedViolations = (reportData.results || []).filter(
          (r) => `${r?.value}`.toUpperCase().includes('VIOLATION') && `${r?.value}`.toUpperCase().includes('FAIL')
        );

        if (topViolations.length) {
          cy.task('table', topViolations);
        } else {
          cy.task('log', 'No violation details available in report results.');
        }

        // Assert the scan produced a report (do not fail the run on real-world site issues).
        expect(counts, 'summary.counts').to.be.an('object');
        expect(counts.violation, 'summary.counts.violation').to.be.a('number');

        // Conditionally fail the test if there are violations.
        const failOnViolations = true;// failedViolations.find((v) => `${v?.value}`.toUpperCase().includes('FAIL'));
        if (failOnViolations) {
          failedViolations.forEach((r) => {
            cy.task('info', `Violation: ${r.ruleId || r.id || r.rule || 'unknown'} - ${r.message || r.reason || 'n/a'}`);
          });
          cy.task('log', 'See report for details:');
          cy.task('log', result?.filePath || 'not saved');

          cy.task('info', `Asserting no violations found (found ${counts.violation})`).then(() => {
            expect(counts.violation, 'no violations').to.equal(0);
          });
        }
      });
    });
  });
})
