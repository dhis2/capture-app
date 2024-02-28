import { When, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';

And('you fill in the first name with values that have duplicates', () => {
    cy.get('[data-test="d2-section"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .wait(500)
        .type('Tesmi')
        .blur();
});

And('you fill in the first name with values that have less than 5 duplicates', () => {
    cy.get('[data-test="d2-section"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Sarah')
        .blur();
    cy.get('[data-test="d2-section"]')
        .find('[data-test="capture-ui-input"]')
        .eq(2)
        .type('Fis')
        .blur();
});

And('you fill in the first name with values that have exactly 5 duplicates', () => {
    cy.get('[data-test="d2-section"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .wait(500)
        .type('Tesmi')
        .blur();
    cy.get('[data-test="d2-section"]')
        .find('[data-test="capture-ui-input"]')
        .eq(2)
        .type('Abel')
        .blur();
});

When('you click create', () => {
    cy.get('[data-test="create-and-link-button"]')
        .click();
});


And('you can see a modal', () => {
    cy.get('[data-test="duplicates-modal"]')
        .should('exist');
});

And('you can see an empty page', () => {
    cy.contains('No results found')
        .should('exist');
});
