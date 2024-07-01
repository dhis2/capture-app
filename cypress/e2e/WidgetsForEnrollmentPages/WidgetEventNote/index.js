import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

Then('the enrollment widget should be loaded', () => {
    cy.contains('The enrollment event data could not be found').should('not.exist');
});

When('you click edit mode', () => {
    cy.contains('[data-test="dhis2-uicore-button"]', 'Edit event')
        .click();
    cy.contains('Enrollment: Edit Event').should('exist');
});

When(/^you fill in the note: (.*)$/, (note) => {
    cy.get('[data-test="event-note-widget"]').within(() => {
        cy.get('[data-test="note-textfield"]').type(note);
        cy.wait(100);

        cy.get('[data-test="add-note-btn"]').should('exist');
        cy.get('[data-test="add-note-btn"]').click();
    });
});

Then(/^list should contain the new note: (.*)$/, (note) => {
    cy.get('[data-test="event-note-widget"]').within(() => {
        cy.get('[data-test="note-item"]').contains(note).should('exist');
    });
});
