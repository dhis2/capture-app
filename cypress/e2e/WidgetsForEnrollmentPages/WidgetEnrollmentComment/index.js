import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

Then('the stages and events should be loaded', () => {
    cy.contains('Stages and Events').should('exist');
});

When(/^you fill in the comment: (.*)$/, (comment) => {
    cy.get('[data-test="enrollment-comment-widget"]').within(() => {
        cy.get('[data-test="comment-textfield"]').type(comment);
        cy.wait(100);

        cy.get('[data-test="add-comment-btn"]').should('exist');
        cy.get('[data-test="add-comment-btn"]').click();
    });
});

Then(/^list should contain the new comment: (.*)$/, (comment) => {
    cy.get('[data-test="enrollment-comment-widget"]').within(() => {
        cy.get('[data-test="comment-item"]').contains(comment).should('exist');
    });
});
