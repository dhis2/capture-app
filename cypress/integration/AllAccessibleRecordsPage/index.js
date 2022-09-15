import '../sharedSteps';

When('the user opens the main page', () => {
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
