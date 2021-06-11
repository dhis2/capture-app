import '../sharedSteps';

beforeEach(() => {
    cy.loginThroughForm();
});

Then('the feedback widget should be displayed', () => {
    cy.get('[data-test="feedback-widget"]')
        .within(() => {
            cy.get('[data-test="widget-content"]').should('exist');
            cy.contains('No feedback for this enrollment yet');
        });
});

When('you click the feedback widget toggle button', () => {
    cy.get('[data-test="feedback-widget"]')
        .within(() => {
            cy.get('[data-test="widget-open-close-toggle-button"]')
                .click();
        });
});

Then('the feedback widget content should not be displayed', () => {
    cy.get('[data-test="feedback-widget"]')
        .within(() => {
            cy.get('[data-test="widget-content"]').should('not.exist');
        });
});
