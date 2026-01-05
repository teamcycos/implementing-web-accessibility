/// <reference types="cypress" />

import 'cypress-axe'
import { PriceRangeSliderComponent } from "src/app/ui-components/price-range-slider/price-range-slider.component"
const injectAxe = () => {
  //cy.injectAxe();
  // cy.injectAxe is currently broken. https://github.com/component-driven/cypress-axe/issues/82

  // Creating our own injection logic
  cy.readFile('node_modules/axe-core/axe.min.js').then((source) => {
    return cy.window({ log: false }).then((window) => {
      window.eval(source);
    });
  });
};
describe('price-range-slider.component.cy.ts', () => {
  beforeEach(() => {
    //cy.injectAxe();
    injectAxe();

    // cy.injectAxe = injectAxe;

  });

  it('playground', () => {
    cy.mount(PriceRangeSliderComponent)
  })

  it('Testing accessibility in Input type=range component', () => {
    cy.mount(PriceRangeSliderComponent, {
      componentProperties: {
        valueMin: '10',
        valueMax: '200'
      }
    })

    // Use element selectors based on accessibility
    // W3C Basic Checklist: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
    const slider = cy.get('h2').should('be.visible');

  //  slider.should('have.attr', 'role', 'slider');
  //  slider.should('have.attr', 'aria-valuenow', '160');
  //  slider.should('have.attr', 'aria-labelledby', 'price-range-label');
    cy.checkA11y(undefined, undefined, undefined, true);

  })
})
