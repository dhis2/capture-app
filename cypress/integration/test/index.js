import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('opens', () => {
    cy.login();
    cy.visit('/');
    cy.get('h1');
});
