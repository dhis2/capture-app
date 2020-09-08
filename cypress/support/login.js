Cypress.Commands.add('loginThroughForm', () => {
    const username = Cypress.env('DHIS2_USERNAME');
    const password = Cypress.env('DHIS2_PASSWORD');
    return cy.visit('/').then(() => {
        cy.get('#j_username').type(username);
        cy.get('#j_password').type(password);
        cy.get('form').submit();
    });
});
