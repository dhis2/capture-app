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
