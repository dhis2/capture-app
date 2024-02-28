import { Given, Then, When, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';

Given('you are on the default search page', () => {
    cy.visit('/#/search');
    cy.get('[data-test="scope-selector"]').should('exist');
});

Then('there should be no search domain preselected', () => {
    cy.get('[data-test="dhis2-uicore-select-input"]')
        .should('exist');
    cy.get('[data-test="informative-paper"]')
        .should('exist');
});

When('you select the search domain Person', () => {
    cy.get('[data-test="dhis2-uicore-select-input"]')
        .click();
    cy.contains('Person')
        .click();
});

Then('there should be Person domain forms available to search with', () => {
    cy.get('[data-test="search-page-content"]')
        .find('[data-test="capture-ui-input"]')
        .should('have.length', 1);
});

Given('you are in the search page with the Child Programme being preselected from the url', () => {
    cy.visit('/#/search?programId=IpHINAT79UW');
});

Given('you are in the search page with domain Person and org unit being preselected', () => {
    cy.visit('/#/search?orgUnitId=DiszpKrYNg8&trackedEntityTypeId=nEenWmSyUEp');
});

And('you select the search domain Malaria Case diagnosis', () => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('Malaria case diagn');
    cy.contains('Malaria case diagnosis')
        .click();
});

When('you select the search domain WHO RMNCH Tracker', () => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('WHO RMNCH');
    cy.contains('WHO RMNCH Tracker')
        .click();
});

When('you fill in the unique identifier field with values that will not return a tracked entity instance', () => {
    cy.get('[data-test="form-unique"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .type('123')
        .blur();
});

And('you click find', () => {
    // click outside of the input for the values to be updated
    cy.get('[data-test="search-page-content"]').click();

    cy.get('[data-test="form-unique"]')
        .find('[data-test="dhis2-uicore-button"]')
        .first()
        .click();
});

Then('there should be a modal popping up', () => {
    cy.contains('[data-test="dhis2-uicore-modal"]', 'No results found')
        .should('exist');
});

When('you can close the modal', () => {
    cy.get('[data-test="dhis2-uicore-modal"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Back to search')
        .click();
    cy.get('[data-test="dhis2-uicore-modal"]')
        .should('not.exist');
});

When('you fill in the unique identifier field with values that will return a tracked entity instance', () => {
    cy.get('[data-test="form-unique"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .clear()
        .type('3131112445555')
        .blur();
});


When('you fill in the first name with values that will return no results', () => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .type('user non existing')
        .blur();
});

And('you expand the attributes search area', () => {
    cy.get('[data-test="form-attributes"]')
        .find('button')
        .first()
        .click();
});

When('you fill in the last name with values that will return results', () => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Smith')
        .blur();
});

When('for Malaria case you fill in values that will return less than 5 results', () => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(2)
        .type('Sara')
        .blur();
});

When('for Person you fill in values that will return less than 5 results', () => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Sara')
        .blur();
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Fis')
        .blur();
});

When('you dont fill in any of the values', () => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .clear();
});

When('you fill the values with nothing but spaces', () => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .type('      ');
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('      ');
});

When('you fill in the the form with values', () => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Smith');

    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Smith');
});

And(/^you fill in the the form with first name value: (.*)$/, (firstName) => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type(firstName)
        .blur();
});

When('you clear the values', () => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .clear();
    cy.get('[data-test="form-attributes"]').click();


    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .clear();
    cy.get('[data-test="form-attributes"]').click();
});

Then('there should be a validation error message', () => {
    cy.get('[data-test="form-attributes"]')
        .contains('Fill in at least 1 attribute to search')
        .shouldIncludeClass('textError');
});

Given('you are on the search page with preselected program and org unit', () => {
    cy.visit('/#/search?programId=qDkgAbB5Jlk&orgUnitId=DiszpKrYNg8');
});

When('when you click the back button', () => {
    cy.get('[data-test="back-button"]')
        .click();
});

Then('you should be taken to the main page with program and org unit preselected', () => {
    cy.url()
        .should('include', `${Cypress.config().baseUrl}/#/?orgUnitId=DiszpKrYNg8&programId=qDkgAbB5Jlk`);
});

And('the next page button is disabled', () => {
    cy.get('[data-test="search-pagination-next-page"]')
        .should('exist')
        .should('be.disabled');
});

When('you click the view dashboard button', () => {
    cy.get('[data-test="view-dashboard-button"]')
        .first()
        .click();
});

When('you remove the Child Programme selection', () => {
    cy.get('[data-test="program-selector-container-clear-icon"]')
        .click();
});

Then('there should be visible a title with Malaria case diagnosis', () => {
    cy.get('[data-test="search-page-content"]')
        .contains('Search for malaria entity in program: Malaria case diagnosis, treatment and investigation')
        .should('exist');
});

And('there should be Malaria case diagnosis forms visible to search with', () => {
    cy.get('[data-test="search-page-content"]')
        .find('[data-test="capture-ui-input"]')
        .should('have.length', 1);
});

Given('you are in the search page with the Adult Woman being preselected from the url', () => {
    cy.visit('/#/search?programId=uy2gU8kT1jF&orgUnitId=DiszpKrYNg8');
});

When('you fill in the date of birth', () => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(2)
        .type('1999-09-01')
        .blur();
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(3)
        .type('2020-01-01')
        .blur();
});

Given('you are in the search page with the TB program being preselected from the url', () => {
    cy.visit('/#/search?programId=ur1Edk5Oe2n&orgUnitId=DiszpKrYNg8');
});

When('you fill in the zip code range numbers', () => {
    cy.get('[data-test="form-attributes"]')
        .find('input[description="Zip code"]')
        .eq(0)
        .type('7130')
        .blur();
    cy.get('[data-test="form-attributes"]')
        .find('input[description="Zip code"]')
        .eq(1)
        .type('7135')
        .blur();
});

When('you fill in the first name', () => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Lid')
        .blur();
});

When('you click the fallback search button', () => {
    cy.contains('Search in all programs')
        .click();
});

When('you fill in the first and last name with values that will return results', () => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Go')
        .blur();

    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Sarah')
        .blur();
});

When('you press enter after filling in the first and last name with values that will return results', () => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Go')
        .blur();

    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Sarah')
        .wait(500)
        .type('{enter}', { force: true });
});

When('you press enter after filling in the unique identifier field with values that will return a tracked entity instance', () => {
    cy.get('[data-test="form-unique"]')
        .find('[data-test="capture-ui-input"]')
        .first()
        .clear()
        .type('3131112445555{enter}');
});

When('you fill in the first name with value and last name with empty space', () => {
    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(0)
        .type('Thomas')
        .blur();

    cy.get('[data-test="form-attributes"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('  ')
        .blur();
});

When('you navigated to a search page with tracked entity id on the url', () => {
    cy.url().should('include', 'search?trackedEntityTypeId=nEenWmSyUEp');
});

When('you can see the domain selector with the tetype person selected', () => {
    cy.get('[data-test="dhis2-uicore-select-input"]')
        .contains('Person');
});

When('there is not enrollment tag', () => {
    cy.get('[data-test="search-results-list"]')
        .find('[data-test="dhis2-uicore-tag"]')
        .should('not.exist');
});

When('you select gender', () => {
    cy.get('[data-test="form-field-cejWyOfXge6"]')
        .find('input')
        .type('Female', { force: true })
        .wait(500)
        .type('{enter}', { force: true });
});

When('you see the attributes search area being expanded', () => {
    cy.get('[data-test="form-attributes"]')
        .contains('First name');
    cy.get('[data-test="form-attributes"]')
        .contains('Last name');
});

When('and you can see the unique identifier input', () => {
    cy.get('[data-test="form-unique"]')
        .find('[data-test="capture-ui-input"]')
        .should('exist');
});

Given('you are in the search page with the Child Programme and org unit being preselected from the url', () => {
    cy.visit('/#/search?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8');
});

When('you click the back button', () => {
    cy.get('[data-test="back-button"]')
        .click();
});

Then('you should be taken to the main page with org unit and program preselected', () => {
    cy.url()
        .should('eq', `${Cypress.config().baseUrl}/#/?orgUnitId=DiszpKrYNg8&programId=IpHINAT79UW&selectedTemplateId=IpHINAT79UW-default`);
});

Then('you stay in the same page with results from all programs being displayed', () => {
    cy.contains('Results found in all programs').should('exist');
});

Then('you should be able to see the Create new section', () => {
    cy.contains('If none of search results match, you can create a new "person".');
});

When('you click Create new button', () => {
    cy.get('[data-test="create-new-button"]').click();
});

Then('you should be taken to the registration page with program with prefilled values', () => {
    cy.get('[data-test="registration-page-content"]')
        .contains('New person in program: Child Programme')
        .should('exist');
    cy.get('[data-test="registration-page-content"]').contains('First name').should('exist');
    cy.get('[data-test="capture-ui-input"]').eq(4).should('have.value', 'Sarah');
    cy.get('[data-test="registration-page-content"]').contains('Last name').should('exist');
    cy.get('[data-test="capture-ui-input"]').eq(5).should('have.value', 'Go');
});

Then('you should be taken to the registration page without program with prefilled values', () => {
    cy.get('[data-test="registration-page-content"]').contains('First name').should('exist');
    cy.get('[data-test="capture-ui-input"]').eq(1).should('have.value', 'Sara');
    cy.get('[data-test="registration-page-content"]').contains('Last name').should('exist');
    cy.get('[data-test="capture-ui-input"]').eq(2).should('have.value', 'Fis');
});
