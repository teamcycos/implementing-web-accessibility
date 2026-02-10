/// <reference types="cypress" />

type ComplianceResult = {
	results?: Array<{ message?: string; level?: string } & Record<string, unknown>>;
};

declare global {
	namespace Cypress {
		interface Chainable {
			getCompliance(url: string, label: string): Chainable<ComplianceResult>;
			assertCompliance(violations: Array<unknown>): Chainable<number>;
		}
	}
}

Cypress.Commands.add("getCompliance", (url: string, label: string) => {
	return cy.task("aCheckerGetCompliance", { url, label }, { log: false }) as Cypress.Chainable<ComplianceResult>;
});

Cypress.Commands.add("assertCompliance", (violations: Array<unknown>) => {
	return cy.task("aCheckerAssertCompliance", { violations }, { log: false }) as Cypress.Chainable<number>;
});

export {};
