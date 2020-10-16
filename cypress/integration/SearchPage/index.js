beforeEach(() => {
    cy.loginThroughForm();
});

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
        .should('have.length', 1);
});

Given('you are in the search page with the Child Programme being preselected from the url', () => {
    cy.visit('/#/search/programId=IpHINAT79UW');
});

Then('there should be visible a title with Child Program', () => {
    cy.get('[data-test="dhis2-capture-search-page-content"]')
        .contains('a Person in program: Child Programme')
        .should('exist');
});

And('there should be Child Programme domain forms visible to search with', () => {
    cy.get('[data-test="dhis2-capture-search-page-content"]')
        .find('[data-test="capture-ui-input"]')
        .should('have.length', 1);
});

And('you select the search domain Child Programme', () => {
    cy.get('.Select')
        .type('Child Program');
    cy.contains('Child Programme')
        .click();
});

And('you select the search domain Malaria Case diagnosis', () => {
    cy.get('.Select')
        .type('Malaria case diagn');
    cy.contains('Malaria case diagnosis')
        .click();
});

When('you fill in the unique identifier field with values that will not return a tracked entity instance', () => {
    cy.get('[data-test="dhis2-capture-form-unique"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .type('123')
        .blur();
});

And('you click find', () => {
    // click outside of the input for the values to be updated
    cy.get('[data-test="dhis2-capture-search-page-content"]').click();

    cy.get('[data-test="dhis2-capture-form-unique"]')
        .find('[data-test="dhis2-uicore-button"]')
        .first()
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
    cy.get('[data-test="dhis2-uicore-modal"]')
        .should('not.exist');
});

When('you fill in the unique identifier field with values that will return a tracked entity instance', () => {
    cy.get('[data-test="dhis2-capture-form-unique"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .clear()
        .type('ZRP792320')
        .blur();
});

Then('you are navigated to the Tracker Capture', () => {
    cy.url().should('include', 'dashboard?tei=');
    cy.url().should('include', 'ou=DiszpKrYNg8&program=qDkgAbB5Jlk');
});

When('you fill in the first name with values that will return no results', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .type('user non existing')
        .blur();
});

And('you expand the attributes search area', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('button')
        .first()
        .click();
});

When('you fill in the last name with values that will return results', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Smith')
        .blur();
});

When('for Malaria case you fill in values that will return less than 5 results', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(2)
        .type('Sara')
        .blur();
});

When('for Person you fill in values that will return less than 5 results', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Sara')
        .blur();
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Gonzales')
        .blur();
});

And('you click search', () => {
    // click outside of the input for the values to be updated
    cy.get('[data-test="dhis2-capture-form-attributes"]').click();

    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="dhis2-uicore-button"]')
        .first()
        .click();
});

When('you fill in the first name with values that will return an error', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .type(',,,,')
        .blur();
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

When('you fill the values with nothing but spaces', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .type('      ');
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('      ');
});

When('you fill in the the form with values', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Smith');

    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Smith');
});

When('you clear the values', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .clear();
    cy.get('[data-test="dhis2-capture-form-attributes"]').click();


    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .clear();
    cy.get('[data-test="dhis2-capture-form-attributes"]').click();
});

Then('there should be a validation error message', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .contains('Fill in at least 1 attributes to search')
        .shouldIncludeClass('textError');
});

Given('you are on the search page with preselected program and org unit', () => {
    cy.visit('/#/search/programId=qDkgAbB5Jlk&orgUnitId=DiszpKrYNg8');
});

When('when you click the back button', () => {
    cy.get('[data-test="dhis2-capture-back-button"]')
        .click();
});

Then('you should be taken to the main page with program and org unit preselected', () => {
    cy.url()
        .should('eq', `${Cypress.config().baseUrl}/#/programId=qDkgAbB5Jlk&orgUnitId=DiszpKrYNg8`);
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


When('you click the next page button', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-next-page"]')
        .click();
});

And('the next page button is disabled', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-next-page"]')
        .should('exist')
        .should('be.disabled');
});

When('you click the view dashboard button', () => {
    cy.get('[data-test="dhis2-capture-view-dashboard-button"]')
        .first()
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

When('you remove the Child Programme selection', () => {
    cy.get('button')
        .find('[class*=ProgramSelector]')
        .click();
});

Then('there should be visible a title with Malaria case diagnosis', () => {
    cy.get('[data-test="dhis2-capture-search-page-content"]')
        .contains('Find a Malaria Entity in program: Malaria case diagnosis, treatment and investigation')
        .should('exist');
});

And('there should be Malaria case diagnosis forms visible to search with', () => {
    cy.get('[data-test="dhis2-capture-search-page-content"]')
        .find('[data-test="capture-ui-input"]')
        .should('have.length', 1);
});

Given('you are in the search page with the Adult Woman being preselected from the url', () => {
    cy.visit('/#/search/programId=uy2gU8kT1jF&orgUnitId=DiszpKrYNg8');
});

When('you fill in the date of birth', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(2)
        .type('1999-09-01')
        .blur();
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(3)
        .type('2020-01-01')
        .blur();
});

Given('you are in the search page with the TB program being preselected from the url', () => {
    cy.visit('/#/search/programId=ur1Edk5Oe2n&orgUnitId=DiszpKrYNg8');
});

When('you fill in the zip code range numbers', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(5)
        .type('7130')
        .blur();
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(6)
        .type('7135')
        .blur();
});

When('you fill in the first name', () => {
    cy.get('[data-test="dhis2-capture-form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Lid')
        .blur();
});
