// eslint-disable-next-line import/no-extraneous-dependencies
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('click the "New" button to add a new event', () => {
    cy.visit('/');
    cy.get('[data-test="dhis2-uicore-button"]', { timeout: 20000 })
        .contains('New')
        .should('exist');
    cy.get('[data-test="dhis2-uicore-button"]').click();
});
Then('you should see text with info', () => {
    cy.get('[data-test="dhis2-capture-paper"]')
        .contains('Select a registering unit and program above to get started')
        .should('exist');
});
