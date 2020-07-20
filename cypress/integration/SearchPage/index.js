Given('you are on the default search page', () => {
    cy.visit('/#/search');
});

Then('there should be no search domain preselected', () => {
    cy.get('[data-test="dhis2-uicore-select-input"]')
        .should('exist');
    cy.get('[data-test="dhis2-capture-informative-paper"]')
        .should('exist');
});

When('you select the search domain Person', () => {
    cy.get('[data-test="dhis2-uicore-select-input"]')
        .click();
    cy.contains('Person')
        .click();
});

Then('there should be Person domain forms available to search with', () => {
    cy.get('[data-test="dhis2-capture-search-page-content"]')
        .find('[data-test="capture-ui-input"]')
        .should('have.length', 3);
});

Given('you are in the search page with the Child Programme being pre-selected from the url', () => {
    cy.visit('/#/search/programId=IpHINAT79UW');
});

Then('there should be search domain Child Programme being pre-selected', () => {
    cy.get('[data-test="dhis2-capture-search-page-content"]')
        .find('[data-test="dhis2-uicore-select-input"]')
        .contains('Child Programme')
        .should('exist');
});

And('there should be Child Programme domain forms visible to search with', () => {
    cy.get('[data-test="dhis2-capture-search-page-content"]')
        .find('[data-test="capture-ui-input"]')
        .should('have.length', 4)
    ;
});

And('you select the search domain Malaria Case diagnosis', () => {
    cy.get('[data-test="dhis2-uicore-select-input"]')
        .type('Malaria case diagn');
    cy.contains('Malaria case diagnosis')
        .click();
});

When('you fill in the unique identifier field with values that will not return a tracked entity instance', () => {
    cy.get('[data-test="dhis2-capture-form-unique"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .type('123');
});

And('you click find', () => {
    cy.get('[data-test="dhis2-capture-form-unique"]')
        .find('[data-test="dhis2-uicore-button"]')
        .first()
        .click()
        .wait(20)
        .click();
});

Then('there should be a modal popping up', () => {
    cy.get('[data-test="dhis2-uicore-modal"]')
        .should('exist');
});

When('you can close the modal', () => {
    cy.get('[data-test="dhis2-uicore-modal"]')
        .find('[data-test="dhis2-uicore-button"]')
        .click();
});

When('you fill in the unique identifier field with values that will return a tracked entity instance', () => {
    cy.get('[data-test="dhis2-capture-form-unique"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .clear()
        .type('ZRP792320');
});

Then('you are navigated to the Tracker Capture', () => {
    cy.contains('ZRP792320').should('exist');
    cy.contains('fgt').should('exist');
    cy.contains('Cohen').should('exist');
});

When('you fill in the first name with values that will return no results', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .type('user non existing');
});

When('you fill in the first name with values that will return results', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(2)
        .type('Lauren');
});

And('you click search', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="dhis2-uicore-button"]')
        .first()
        .click()
        .wait(20)
        .click();
});

Then('there should be a success message', () => {
    cy.get('h3')
        .contains('Your search has given results.')
        .should('exist');
});

When('you fill in the first name with values that will return an error', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .type(',,,,');
});

Then('there should be an generic error message', () => {
    cy.get('[data-test="dhis2-capture-general-purpose-error-mesage"]')
        .should('exist');
});

When('you dont fill in any of the values', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .clear();
});

Then('there should be a validation error message', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .contains('Fill in at least 1 attributes to search')
        .shouldIncludeClass('textError');
});

Given('you are on the search page with preselected program and org unit', () => {
    cy.visit('/#/search/programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

When('when you click the back button', () => {
    cy.get('[data-test="dhis2-capture-back-button"]')
        .click();
});

Then('you should be taken to the main page with program and org unit preselected', () => {
    cy.url()
        .should('eq', `${Cypress.config().baseUrl}/#/programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8`);
});

