import { Given, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';

Given(/^you land on the enrollment (.*) page by having typed (.*)$/, (_, url) => {
    cy.visit(url);
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
