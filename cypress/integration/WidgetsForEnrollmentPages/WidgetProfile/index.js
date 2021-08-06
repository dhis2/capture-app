
Then('the profile details should be displayed', () => {
    cy.get('[data-test="profile-widget"]')
        .within(() => {
            cy.get('[data-test="widget-contents"]', { timeout: 1000 }).should('be.visible');
            cy.get('[data-test="profile-widget-flatlist"]').should('be.visible');
            cy.contains('First name').should('exist');
            cy.contains('Anna').should('exist');
            cy.contains('Last name').should('exist');
            cy.contains('Jones').should('exist');
        });
});

Then('the widget profile should be closed', () => {
    cy.get('[data-test="profile-widget"]')
        .within(() => {
            cy.get('[data-test="widget-contents"]')
                .children()
                .should('not.exist');
        });
});

