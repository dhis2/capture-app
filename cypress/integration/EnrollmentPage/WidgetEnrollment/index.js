import '../sharedSteps';

beforeEach(() => {
    cy.loginThroughForm();
});

Then('the program stages should be displayed', () => {
    cy.get('[data-test="enrollment-widget"]')
        .within(() => {
            cy.contains('Birth').should('exist');
            cy.contains('Baby Postnatal').should('exist');
        });
});

When('you click the enrollment widget toggle open close button', () => {
    cy.get('[data-test="enrollment-widget"]')
        .within(() => {
            cy.get('[data-test="widget-open-close-toggle-button"]')
                .click();
        });
});

Then('the enrollment widget should be closed', () => {
    cy.get('[data-test="enrollment-widget"]')
        .within(() => {
            cy.get('[data-test="widget-contents"]')
                .children()
                .should('not.exist');
            cy.contains('Birth').should('not.exist');
        });
});
