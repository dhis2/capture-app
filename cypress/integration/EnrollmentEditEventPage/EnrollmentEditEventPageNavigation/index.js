Given(/^you land on the enrollment event page by having typed (.*)$/, (url) => {
    cy.visit(url);
    cy.get('[data-test="scope-selector"]').contains('Selected person');
});

Given('you open the enrollment page which has multiples events and stages', () => {
    cy.visit('#/enrollment?enrollmentId=ek4WWAgXX5i');
});

When(/^the user clicks the event with the report date (.*)$/, (date) => {
    cy.contains(date).click();
});

When(/^the user clicks the "Back to all stages and events" button/, () =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="dhis2-uicore-button"]')
        .eq(0)
        .click(),
);

Then(/^you see the following (.*)$/, (message) => {
    cy.contains(message);
});

Then('the program stages should be displayed', () => {
    cy.get('[data-test="stages-and-events-widget"]')
        .within(() => {
            cy.contains('Antenatal care visit').should('exist');
            cy.contains('Care at birth').should('exist');
        });
});
