
beforeEach(() => {
    cy.loginThroughForm();
});

Given('you open the the new event page in Ngelehun and malaria case context', () => {
    cy.visit('/#/newEvent/programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

And('you navigate to find a person relationship', () => {
    cy.get('[data-test="dhis2-capture-add-relationship-button"]')
        .click();
    cy.get('[data-test="dhis2-capture-relationship-type-selector-button-mxZDvSZYxlw"]')
        .click();
    cy.get('[data-test="dhis2-capture-find-relationship-button"]')
        .click();
});

And('you select search scope TB program', () => {
    cy.get('[data-test="dhis2-capture-virtualized-select"]')
        .click()
        .contains('TB prog')
        .click();
});

When('you expand the fifth search area', () => {
    cy.get('[data-test="dhis2-capture-collapsible-button"]')
        .eq(4)
        .click();
});

When('you expand the third search area', () => {
    cy.get('[data-test="dhis2-capture-collapsible-button"]')
        .eq(2)
        .click();
});

And('you fill in the first name with values that will return no results', () => {
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Name doesnt exist')
        .blur();
});

And('you fill in the first name with values that will return results', () => {
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Tesmi')
        .blur();
});

And('you click search', () => {
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('button')
        .click();
});


And('you can see an empty page', () => {
    cy.contains('No Person found')
        .should('exist');
});

Then('all pagination is disabled', () => {
    cy.get('[data-test="dhis2-capture-pagination"]')
        .contains('Page 1')
        .should('exist');
});

And('there should be a validation error message', () => {
    cy.contains('Fill in at least 1 attributes to search')
        .should('exist');
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('[class*=minAttribtuesRequiredInvalid]');
});

And('you fill the values with nothing but spaces', () => {
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('      ');
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('      ');
});

And('you fill in the the form with values', () => {
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Tesmi')
        .blur();
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Tesmi')
        .blur();
});

And('you clear the values', () => {
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .clear();
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .clear();
});

And('you fill in the first name with values that will return an error', () => {
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .type(',,,,')
        .blur();
});

Then('you click the next page button', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-next-page"]')
        .click();
});

Then('you can see the second page of the results', () => {
    cy.get('[data-test="dhis2-capture-search-results-top"]')
        .should('exist');
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

Then('you can see the first page of the results', () => {
    cy.get('[data-test="dhis2-capture-search-results-top"]')
        .should('exist');
    cy.get('[data-test="dhis2-capture-search-results-list"]')
        .should('exist');
    cy.get('[data-test="dhis2-capture-card-list-item"]')
        .should('have.length.greaterThan', 0);
    cy.get('[data-test="dhis2-capture-pagination"]')
        .contains('Page 1')
        .should('exist');
});

And('the next page button is disabled', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-next-page"]')
        .should('exist')
        .should('be.disabled');
    cy.get('[data-test="dhis2-capture-search-pagination-previous-page"]')
        .should('exist')
        .should('be.disabled');
    cy.get('[data-test="dhis2-capture-search-pagination-first-page"]')
        .should('exist')
        .should('be.disabled');
});

And('you fill in the the form with values that will return less than 5 results', () => {
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Sara')
        .blur();
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Gonzalez')
        .blur();
});

