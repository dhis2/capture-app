import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

const timeStamp = Math.round((new Date()).getTime() / 1000);

Then('the stages and events should be loaded', () => {
    cy.contains('Stages and Events').should('exist');
});

When(/^you fill in the note: (.*)$/, (note) => {
    cy.get('[data-test="enrollment-note-widget"]').within(() => {
        cy.get('[data-test="note-textfield"]').type(`${note}-${timeStamp}`);
        cy.wait(100);

        cy.get('[data-test="add-note-btn"]').should('exist');
        cy.get('[data-test="add-note-btn"]').click();
    });
});

Then(/^list should contain the new note: (.*)$/, (note) => {
    cy.get('[data-test="enrollment-note-widget"]').within(() => {
        cy.get('[data-test="note-item"]').contains(`${note}-${timeStamp}`).should('exist');
    });
});
