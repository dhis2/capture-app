Given('you are in the main page with no selections made', () => {
    cy.visit('/#/');
    cy.get('[data-test="dhis2-capture-new-event-button"]')
        .should('exist');
});

And('you see the dropdown menu for selecting tracked entity type', () => {
    cy.get('[data-test="dhis2-uicore-singleselect"]')
        .should('exist');
    cy.contains('You can also choose a program from the top bar')
        .should('exist');
});

And('you select org unit', () => {
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
});

Then('there should be visible a title with Child Program', () => {
    cy.get('[data-test="dhis2-capture-search-page-content"]')
        .contains('person in program: Child Programme')
        .should('exist');
});

And('there should be Child Programme domain forms visible to search with', () => {
    cy.get('[data-test="dhis2-capture-search-page-content"]')
        .find('[data-test="capture-ui-input"]')
        .should('have.length', 1);
});

Given('you open the the new event page in Ngelehun and malaria case context', () => {
    cy.visit('/#/new?programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

When('you navigate to register a person relationship', () => {
    cy.get('[data-test="dhis2-capture-add-relationship-button"]')
        .click();
    cy.get('[data-test="dhis2-capture-relationship-type-selector-button-mxZDvSZYxlw"]')
        .click();
    cy.get('[data-test="dhis2-capture-create-relationship-button"]')
        .click();
});

And('you navigate to find a person relationship', () => {
    cy.get('[data-test="dhis2-capture-add-relationship-button"]')
        .click();
    cy.get('[data-test="dhis2-capture-relationship-type-selector-button-mxZDvSZYxlw"]')
        .click();
    cy.get('[data-test="dhis2-capture-find-relationship-button"]')
        .click();
});

And('you select Child Programme', () => {
    cy.get('.Select')
        .type('Child Program');
    cy.contains('Child Programme')
        .click();
});

When('you have no program selection', () => {
    cy.get('[data-test="dhis2-capture-program-selector-container"]')
        .contains('Select program');
});

When('you click the next page button', () => {
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

And('you can see the first page of the results', () => {
    cy.get('[data-test="dhis2-capture-search-results-list"]')
        .should('exist');
    cy.get('[data-test="dhis2-capture-card-list-item"]')
        .should('have.length.greaterThan', 0);
    cy.get('[data-test="dhis2-capture-pagination"]')
        .contains('Page 1')
        .should('exist');
});

Then('all pagination is disabled', () => {
    cy.get('[data-test="dhis2-capture-pagination"]')
        .contains('Page 1')
        .should('exist');
});

And('you click search', () => {
    // click outside of the input for the values to be updated
    cy.get('[data-test="dhis2-capture-d2-form-component"]')
        .click();

    cy.get('button')
        .contains('Search by attributes')
        .click();
});

And('you reset the program selection', () => {
    cy.get('[data-test="reset-selection-button"]')
        .should('have.length.greaterThan', 2);
    cy.get('[data-test="reset-selection-button"]')
        .eq(0)
        .click();
});

And('you select the MNCH PNC program', () => {
    cy.get('.Select').eq(0)
        .type('MNCH');
    cy.contains('PNC (Adult Woman)')
        .click();
});

