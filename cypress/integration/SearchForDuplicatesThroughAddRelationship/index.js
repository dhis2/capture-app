
beforeEach(() => {
    cy.loginThroughForm();
});

Given('you open the the new event page in Ngelehun and malaria case context', () => {
    cy.visit('/#/newEvent/programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

When('you navigate to register a person relationship', () => {
    cy.get('[data-test="dhis2-capture-add-relationship-button"]')
        .click();
    cy.get('[data-test="dhis2-capture-relationship-type-selector-button-mxZDvSZYxlw"]')
        .click();
    cy.get('[data-test="dhis2-capture-create-relationship-button"]')
        .click();
});


And('you fill in the first name with values that have duplicates', () => {
    cy.get('[data-test="dhis2-capture-d2-form-component"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Tesmi')
        .blur();
});

And('you fill in the first name with values that have less than 5 duplicates', () => {
    cy.get('[data-test="dhis2-capture-d2-form-component"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Sarah')
        .blur();
    cy.get('[data-test="dhis2-capture-d2-form-component"]')
        .find('[data-test="capture-ui-input"]')
        .eq(2)
        .type('Gonz')
        .blur();
});

And('you fill in the first name with values that have exactly 5 duplicates', () => {
    cy.get('[data-test="dhis2-capture-d2-form-component"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Tesmi')
        .blur();
    cy.get('[data-test="dhis2-capture-d2-form-component"]')
        .find('[data-test="capture-ui-input"]')
        .eq(2)
        .type('Abel')
        .blur();
});

When('you click create', () => {
    cy.get('[data-test="dhis2-capture-possible-duplicates-found-button"]')
        .should('exist');

    cy.get('[data-test="dhis2-capture-create-and-link-button"]')
        .click();
});

When('you click the show possible duplicates button', () => {
    cy.get('[data-test="dhis2-capture-possible-duplicates-found-button"]')
        .click();
});


And('you can see a modal', () => {
    cy.get('[data-test="dhis2-capture-duplicates-modal"]')
        .should('exist');
});

And('you can see the first page of the results', () => {
    cy.get('[data-test="dhis2-capture-search-results-list"]')
        .should('exist');
    cy.get('[data-test="dhis2-capture-card-list-item"]')
        .should('have.length.greaterThan', 0);
    cy.get('[data-test="dhis2-capture-pagination"]')
        .contains('Page 1')
        .should('exist');
});

Then('you click the next page button', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-next-page"]')
        .click();
});

Then('you can see the second page of the results', () => {
    cy.get('[data-test="dhis2-capture-search-results-list"]')
        .should('exist');
    cy.get('[data-test="dhis2-capture-card-list-item"]')
        .should('have.length.greaterThan', 0);
    cy.get('[data-test="dhis2-capture-pagination"]')
        .contains('Page 2')
        .should('exist');
});

When('you click the previous page button', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-previous-page"]')
        .click();
});

Then('all pagination is disabled', () => {
    cy.get('[data-test="dhis2-capture-pagination"]')
        .contains('Page 1')
        .should('exist');
});

And('you can see an empty page', () => {
    cy.contains('No results found')
        .should('exist');
});

Then('all pagination is disabled', () => {
    cy.get('[data-test="dhis2-capture-pagination"]')
        .contains('Page 1')
        .should('exist');
});

