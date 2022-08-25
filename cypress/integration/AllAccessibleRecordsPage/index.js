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

When(/^the user selects the program (.*)$/, (program) => {
    cy.get('.Select')
        .type(program.slice(0, -1));
    cy.contains(program)
        .click();
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
    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Edit Event')
        .click();
    cy.get('[data-test="capture-ui-input"]')
        .contains('34')
        .type('35')
        .blur();
    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Save')
        .click();
});

Then('the working list will be updated', () => {
    cy.get('[data-test="main-page-working-list"]')
        .find('tr')
        .eq(1)
        .within((row) => {
            row.contains('35');
        });
});
