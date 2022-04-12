import '../sharedSteps';

beforeEach(() => {
    cy.loginThroughForm();
});

Given('you are in the main page with Child program preselected', () => {
    cy.visit('/#/?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8');
});

Given('you are in the main page with Antenatal care program preselected', () => {
    cy.visit('/#/?programId=lxAQ7Zs9VYR&orgUnitId=lxAQ7Zs9VYR');
});

Given('you are in the main page with MNCH PNC program preselected', () => {
    cy.visit('/#/?programId=uy2gU8kT1jF&orgUnitId=DiszpKrYNg8');
});

Given('you are in the main page without a program preselected', () => {
    cy.visit('/#/?orgUnitId=DiszpKrYNg8');
});

Then('the working list is displayed', () => {
    cy.get('[data-test="tei-working-lists"]').within(() => {
        cy.contains('Rows per page').should('exist');
        cy.contains('First name').should('exist');
        cy.contains('Last name').should('exist');
    });
});

Then('the search form is displayed', () => {
    cy.get('[data-test="search-page-content"]')
        .contains('Search for person in program: MNCH / PNC (Adult Woman)')
        .should('exist');
});
