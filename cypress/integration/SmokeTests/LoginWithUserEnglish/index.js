beforeEach(() => {
    cy.loginThroughForm('DHIS2_USERNAME_ENGLISH', 'DHIS2_PASSWORD_ENGLISH');
});

Given('you open the capture app', () => {
    cy.visit('/');
});

Then('you should see the app main selections', () => {
    cy.get('[data-test="dhis2-capture-org-unit-selector-container"]');

    cy.get('[data-test="dhis2-capture-program-selector-container"]');
});
