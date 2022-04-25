import '../sharedSteps';

beforeEach(() => {
    cy.loginThroughForm();
});

Then('the TEI working list is displayed', () => {
    cy.get('[data-test="tei-working-lists"]').within(() => {
        cy.contains('Rows per page').should('exist');
        cy.contains('First name').should('exist');
        cy.contains('Last name').should('exist');
    });
});

Then('the event working list is displayed', () => {
    cy.get('[data-test="event-working-lists"]').within(() => {
        cy.contains('Visit date').should('exist');
        cy.contains('Status').should('exist');
    });
});

Then('the search form is displayed', () => {
    cy.get('[data-test="search-page-content"]')
        .contains('Search for person in program: MNCH / PNC (Adult Woman)')
        .should('exist');
});
