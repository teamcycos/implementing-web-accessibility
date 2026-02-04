/// <reference types="cypress" />

import "cypress-axe";
import { ItemCardComponent } from "src/app/ui-components/item-card/item-card.component";

const injectAxe = () => {
	//cy.injectAxe();
	// cy.injectAxe is currently broken. https://github.com/component-driven/cypress-axe/issues/82

	// Creating our own injection logic
	cy.readFile("node_modules/axe-core/axe.min.js").then((source) => {
		return cy.window({ log: false }).then((window) => {
			window.eval(source);
		});
	});
};
describe("item-card.component.cy.ts", () => {
	beforeEach(() => {
		//cy.injectAxe();
		injectAxe();

		// cy.injectAxe = injectAxe;
	});

	it("playground", () => {
		cy.mount(ItemCardComponent, {
			componentProperties: {
				name: "Item 1",
				link: "link/to/item1",
				image: "./assets/images/ukulele.jpg",
				description: "short desc for Item 1",
				price: 130,
			},
		});
		// cy.checkA11y();
	});

	it("Image should have alt text", () => {
		const description = "Short desc for Item 1 ";
		const price = 130;
		const articleLabel = "Short desc for Item 1  Product price is €130";

		cy.mount(ItemCardComponent, {
			componentProperties: {
				name: "Item 1",
				link: "link/to/item1",
				image: "./assets/images/ukulele.jpg",
				description,
				price,
			},
		});
		cy.checkA11y(undefined, undefined, undefined, true);
		// Use element selectors based on accessibility
		const item = cy.get("a");

		// item.should('have.attr', 'aria-label', articleLabel);
		// item.contains('article', description).should('be.visible');

		// Once clicking on an article is implemented:
		// Something like this...
		// item.should('have.attr', 'aria-label', articleLabel).click();
	});
});
