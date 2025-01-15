import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given(/^you land on a enrollment page domain by having typed (.*)$/, (url) => {
    cy.visit(url);
    cy.get('[data-test="person-selector-container"]').contains('Person');
});

Then('the Related stages Actions should be visible at the bottom of the page', () => {
    cy.get('[data-test="related-stages-section"]')
        .should('be.visible')
        .and('contain', 'Actions - Birth to Baby postnatal');
});
