Then('the enrollment widget should be loaded', () => {
    cy.contains('The enrollment event data could not be found').should('not.exist');
});


When(/^you fill in the comment: (.*)$/, (comment) => {
    cy.get('[data-test="event-comment-widget"]').within(() => {
        cy.get('[data-test="comment-textfield"]').type(comment);
        cy.wait(100);

        cy.get('[data-test="add-note-btn"]').should('exist');
        cy.get('[data-test="add-note-btn"]').click();
    });
});

Then(/^list should contain the new comment: (.*)$/, (comment) => {
    cy.get('[data-test="event-comment-widget"]').within(() => {
        cy.get('[data-test="comment-item"]').contains(comment).should('exist');
    });
});
