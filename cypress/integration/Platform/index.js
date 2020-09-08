beforeEach(() => {
    /*
        Cypress automatically clears all cookies between tests except cross domain cookies.
        When we are working with a remote instance, we need to clear the login cookie associated with the remote domain.
        Currently, calling clearCookies with domain:null is a workaround to get rid of the cross domain cookies.
        Related Cypress issue https://github.com/cypress-io/cypress/issues/408
    */
    cy.clearCookies({ domain: null });
});

Given('you open the App without auth cookie', () => {
    cy.visit('/');
});

Then('you should see the login prompt', () => {
    cy.get('[data-test="dhis2-adapter-loginsubmit"]')
        .should('exist');
});

When('you fill in credentials', () => {
    cy.get('[data-test="dhis2-adapter-loginname"]')
        .find('input')
        .type('admin');
    cy.get('[data-test="dhis2-adapter-loginpassword"]')
        .find('input')
        .type('district');
});

When('you sign in', () => {
    cy.get('[data-test="dhis2-adapter-loginsubmit"]')
        .click();
});

Then('you should see the app main selections', () => {
    cy.get('[data-test="dhis2-capture-org-unit-selector-container"]', { timeout: 20000 })
        .should('exist');
    cy.get('[data-test="dhis2-capture-program-selector-container"]')
        .should('exist');
});

Then('you should see the header bar', () => {
    cy.get('[data-test="headerbar-title"]')
        .should('exist');
});

Given('you open the app with auth cookie', () => {
    cy.login();
    cy.visit('/');
});
