import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given(/^you open the enrollment page by typing (.*)$/, url =>
    cy.visit(url),
);

Given('you are on an enrollment page with stage available', () => {
    cy.visit('/#/enrollment?programId=ur1Edk5Oe2n&orgUnitId=UgYg0YW7ZIh&teiId=zmgVvEZ91Kg&enrollmentId=xRnBV5aJDeF');
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Enrollment Dashboard');
});

Given('you are on an enrollment page with no stage available', () => {
    cy.visit('/#/enrollment?programId=IpHINAT79UW&orgUnitId=UgYg0YW7ZIh&teiId=fhFQhO0xILJ&enrollmentId=gPDueU02tn8');
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Enrollment Dashboard');
});

When(/^you click the (.*) event-button/, (mode) => {
    cy.get(`[data-test=quick-action-button-${mode}]`)
        .click();
});

Then(/^you should be navigated to the (.*) tab/, (tab) => {
    cy.url()
        .should('include', 'enrollmentEventNew')
        .should('include', `tab=${tab.toUpperCase()}`);
});

Then('the buttons should be disabled', () => {
    cy.get('[data-test=quick-action-button-container]')
        .find('button')
        .each(($button) => {
            cy.wrap($button)
                .should('be.disabled');
        });
});

Then('the quick action buttons should be disabled', () => {
    cy.get('[data-test="quick-action-button-container"]')
        .find('button')
        .should('be.disabled');
});
