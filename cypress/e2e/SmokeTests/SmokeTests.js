import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Then('you should see the app main selections', () => {
    cy.get('[data-test="org-unit-selector-container"]');
    cy.get('[data-test="program-selector-container"]');
});

Given('you open the App without auth cookie', () => {
    cy.visit('/');
});

Then('you should see the login prompt', () => {
    cy.get('[data-test="dhis2-adapter-loginsubmit"]');

    cy.get('[data-test="dhis2-adapter-loginname"]')
        .find('#j_username');

    cy.get('[data-test="dhis2-adapter-loginpassword"]')
        .find('#j_password');

    cy.get('#j_username');

    cy.get('#j_password');
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
    cy.get('form')
        .submit();
});

Then('you should see the header bar', () => {
    cy.get('[data-test="headerbar-title"]');
});
