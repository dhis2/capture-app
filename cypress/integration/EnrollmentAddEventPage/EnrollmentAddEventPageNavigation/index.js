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
    const data = [
        'First name',
        'Last name',
        'Gender',
        'Unique ID',
    ];

    cy.get('[data-test="add-event-enrollment-page-content"]')
        .within(() => {
            cy.get('[data-test="dataentry-field-enrollmentDate"]').contains('Date of enrollment');
            cy.get('[data-test="dataentry-field-incidentDate"]').contains('Date of birth');
            cy.get('[data-test="dataentry-field-geometry"]').contains('Coordinate');
            cy.get('[data-test="add-event-form"]')
                .find('[data-test^=form-field-]')
                .should('have.length', 4)
                .each(($row, index) => {
                    cy.wrap($row)
                        .contains(data[index])
                        .should('exist');
                });
        });
});
