import { When, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';

And('you select search scope TB program', () => {
    cy.get('[data-test="virtualized-select"]')
        .click()
        .contains('TB prog')
        .click();
});

When('you expand the fifth search area', () => {
    cy.get('[data-test="collapsible-button"]')
        .eq(4)
        .click();
});

When('you expand the third search area', () => {
    cy.get('[data-test="collapsible-button"]')
        .eq(2)
        .click();
});

And('you fill in the first name with values that will return no results', () => {
    cy.get('[data-test="d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Name doesnt exist')
        .blur();
});

And('you fill in the first name with values that will return results', () => {
    cy.get('[data-test="d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Tesmi')
        .blur();
});

And('you can see an empty page', () => {
    cy.contains('No Person found')
        .should('exist');
});

And('there should be a validation error message', () => {
    cy.contains('Fill in at least 1 attribute to search')
        .should('exist');
    cy.get('[data-test="d2-form-area"]')
        .find('[class*=minAttribtuesRequiredInvalid]');
});

And('you fill the values with nothing but spaces', () => {
    cy.get('[data-test="d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('      ');
    cy.get('[data-test="d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('      ');
});

And('you fill in the the form with values', () => {
    cy.get('[data-test="d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Tesmi')
        .blur();
    cy.get('[data-test="d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Tesmi')
        .blur();
});

And('you clear the values', () => {
    cy.get('[data-test="d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .clear();
    cy.get('[data-test="d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .clear();
});

And('you fill in the first name with values that will return an error', () => {
    cy.get('[data-test="d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .type(',,,,')
        .blur();
});

And('the next page button is disabled', () => {
    cy.get('[data-test="search-pagination-next-page"]')
        .should('exist')
        .should('be.disabled');
    cy.get('[data-test="search-pagination-previous-page"]')
        .should('exist')
        .should('be.disabled');
    cy.get('[data-test="search-pagination-first-page"]')
        .should('exist')
        .should('be.disabled');
});

And('you fill in the the form with values that will return less than 5 results', () => {
    cy.get('[data-test="d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Sara')
        .blur();
    cy.get('[data-test="d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Gonzalez')
        .blur();
});

And('you fill in the the form with values that will return exactly 5 results', () => {
    cy.get('[data-test="d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Tesmi')
        .blur();
    cy.get('[data-test="d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Abel')
        .blur();
});

When('you fill in the zip code range numbers', () => {
    cy.get('[data-test="d2-form-area"]')
        .find('input[description="Zip code"]')
        .eq(0)
        .type('7130')
        .blur();
    cy.get('[data-test="d2-form-area"]')
        .find('input[description="Zip code"]')
        .eq(1)
        .type('7135')
        .blur();
});

