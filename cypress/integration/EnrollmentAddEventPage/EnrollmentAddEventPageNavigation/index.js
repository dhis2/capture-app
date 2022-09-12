Given(/^you land on the enrollment (.*) page by having typed (.*)$/, (_, url) => {
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
    const fields = [
        'Apgar Score',
        'Weight (g)',
        'ARV at birth',
        'BCG dose',
        'OPV dose',
        'Infant Feeding',
        'Birth certificate',
    ];

    cy.get('[data-test="add-event-enrollment-page-content"]')
        .within(() => {
            fields.forEach((field) => {
                cy.get('[data-test="new-enrollment-event-form"]')
                    .contains(field)
                    .should('exist');
            });
        });
});
