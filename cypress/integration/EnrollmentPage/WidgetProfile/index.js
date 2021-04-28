import '../sharedSteps';

beforeEach(() => {
    cy.loginThroughForm();
});

Then('the profile details should be displayed', () => {
    cy.get('[data-test="profile-widget"]')
        .within(() => {
            cy.contains('[data-test="profile-widget-flatlist"]').should('exist');
        });
});

When('you click the widget profile toggle open close button', () => {
    cy.get('[data-test="profile-widget"]')
        .within(() => {
            cy.get('[data-test="widget-open-close-toggle-button"]')
                .click();
        });
});

Then('the widget profile should be closed', () => {
    cy.get('[data-test="profile-widget"]')
        .within(() => {
            cy.get('[data-test="profile-widget-flatlist"]')
                .children()
                .should('not.exist');
        });
});
