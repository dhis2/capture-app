Cypress.Commands.add('loginThroughForm', () => {
    const username = Cypress.env('dhis2_username');
    const password = Cypress.env('dhis2_password');
    return cy.visit('/').then(() => {
        cy.get('#j_username').type(username);
        cy.get('#j_password').type(password);
        cy.get('form').submit();
    });
});
