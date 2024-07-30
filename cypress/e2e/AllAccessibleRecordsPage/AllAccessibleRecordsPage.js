import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('the user is on the the main page', () => {
    cy.visit('/#/');
});

Then('the working list should not be displayed', () => {
    cy.get('[data-test="main-page-working-list"]')
        .should('not.exist');
});

Then('the working list should be displayed', () => {
    cy.get('[data-test="main-page-working-list"]')
        .find('tr');
});

When('the IncompleteSelections-box should be displayed', () => {
    cy.get('[data-test="without-orgunit-selected-message"]')
        .within(() => {
            cy.contains('Please select an organisation unit.');
            cy.get('[data-test="show-accessible-button"]')
                .should('exist');
        });
});

When('the user clicks the show accessible button', () => {
    cy.get('[data-test="show-accessible-button"]')
        .click();
});

When(/^the user navigates to (.*)$/, (url) => {
    cy.visit(url);
});

When('the user clicks a row', () => {
    cy.get('[data-test="main-page-working-list"]')
        .find('tr')
        .eq(1)
        .click();
});

When('edits and save the form', () => {
    cy.contains('Edit event')
        .click();


    cy.contains('[data-test="form-field"]', 'WHOMCH Hemoglobin value')
        .find('input')
        .clear()
        .type('99')
        .blur();

    cy.contains('Save')
        .click();
});

Then('the working list should be updated', () => {
    cy.get('.app-shell-app').scrollTo('bottom');

    cy.get('[data-test="select-columns-reference"]')
        .click();

    cy.contains('WHOMCH Hemoglobin value')
        .parents('tr')
        .find('input[type="checkbox"]')
        .click();

    cy.contains('Save')
        .click();

    cy.get('[data-test="main-page-working-list"]')
        .find('tr')
        .eq(1)
        .contains('99');

    // clean up
    cy.get('[data-test="main-page-working-list"]')
        .find('tr')
        .eq(1)
        .click();

    cy.contains('Edit event')
        .click();


    cy.contains('[data-test="form-field"]', 'WHOMCH Hemoglobin value')
        .find('input')
        .clear()
        .type('9')
        .blur();

    cy.contains('Save')
        .click();
});
