import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

const timeStamp = Math.round((new Date()).getTime() / 1000);

Then('the enrollment widget should be loaded', () => {
    cy.contains('The enrollment event data could not be found').should('not.exist');
});

When('you click edit mode', () => {
    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="widget-enrollment-event-edit-button"]')
        .click();
    cy.get('[data-test="widget-enrollment-event-edit"]').should('exist');
});

When(/^you fill in the note: (.*)$/, (note) => {
    cy.get('[data-test="event-note-widget"]').within(() => {
        cy.get('[data-test="note-textfield"]').type(`${note}-${timeStamp}`);
        cy.wait(100);

        cy.get('[data-test="add-note-btn"]').should('exist');
        cy.get('[data-test="add-note-btn"]').click();
    });
});

Then(/^list should contain the new note: (.*)$/, (note) => {
    cy.get('[data-test="event-note-widget"]').within(() => {
        cy.get('[data-test="note-item"]').contains(`${note}-${timeStamp}`).should('exist');
    });
});
