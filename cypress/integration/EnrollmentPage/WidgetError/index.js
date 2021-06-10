import '../sharedSteps';

beforeEach(() => {
    cy.loginThroughForm();
});

Then('the error widget should be displayed', () => {
    cy.get('[data-test="error-widget"]')
        .within(() => {
            cy.get('[data-test="widget-content"]', { timeout: 1000 })
                .should('be.visible')
                .should('have.css', 'background-color')
                .and('eq', 'rgb(255, 229, 232)');
        });
});
