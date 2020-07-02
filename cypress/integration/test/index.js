// eslint-disable-next-line import/no-extraneous-dependencies
import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('opens', () => {
    cy.visit('/');
    cy.get('h1');
});
