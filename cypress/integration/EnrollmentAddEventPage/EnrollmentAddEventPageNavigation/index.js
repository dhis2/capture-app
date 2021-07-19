beforeEach(() => {
    cy.loginThroughForm();
});

Given(/^you land on the enrollment add event page by having typed (.*)$/, (url) => {
    cy.visit(url);
});

Then(/^you see the following (.*)$/, (message) => {
    cy.contains(message);
});

And(/^you see the widget header (.*)$/, (name) => {
    cy.get('[data-test="add-event-enrollment-page-content"]')
        .within(() => {
            cy.get('[data-test="widget-contents"]').should('exist');
            cy.get('[data-test="widget-header"]').should('exist');
            cy.contains(name).should('exist');
        });
});

And('you see the add event form details', () => {
    cy.get('[data-test="add-event-enrollment-page-content"]')
        .within(() => {
            cy.get('[data-test="edit-event-form"]').should('exist');
        });
});
