import {
    Given,
    When,
    Then,
    defineStep as And, Before,
} from '@badeball/cypress-cucumber-preprocessor';
import { filterInstanceVersion, shouldClearCookies } from '../support/tagUtils';

Before(function callback() {
    filterInstanceVersion(() => this.skip());
    if (shouldClearCookies()) {
        cy.clearAllCookies();
    }
});

Given('you are in the main page with no selections made', () => {
    cy.visit('/#/');
    cy.get('[data-test="new-event-button"]')
        .should('exist');
});

And('you see the dropdown menu for selecting tracked entity type', () => {
    cy.get('[data-test="dhis2-uicore-singleselect"]')
        .should('exist');
    cy.contains('You can also choose a program from the top bar')
        .should('exist');
});

And('you select org unit', () => {
    cy.get('[data-test="org-unit-selector-container"]')
        .click();
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
});

Then('there should be visible a title with Child Program', () => {
    cy.get('[data-test="search-page-content"]')
        .contains('person in program: Child Programme')
        .should('exist');
});

And('there should be Child Programme domain forms visible to search with', () => {
    cy.get('[data-test="search-page-content"]')
        .find('[data-test="capture-ui-input"]')
        .should('have.length', 1);
});

Given('you open the the new event page in Ngelehun and malaria case context', () => {
    cy.visit('/#/new?programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

When('you navigate to register a person relationship', () => {
    cy.get('[data-test="add-relationship-button"]')
        .click();
    cy.get('[data-test="relationship-type-selector-button-mxZDvSZYxlw"]')
        .click();
    cy.get('[data-test="create-relationship-button"]')
        .click();
});

And('you navigate to find a person relationship', () => {
    cy.get('[data-test="add-relationship-button"]')
        .click();
    cy.get('[data-test="relationship-type-selector-button-mxZDvSZYxlw"]')
        .click();
    cy.get('[data-test="find-relationship-button"]')
        .click();
});

And('you select Child Programme', () => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('Child Program');
    cy.contains('Child Programme')
        .click();
});

When('you have no program selection', () => {
    cy.get('[data-test="program-selector-container"]')
        .contains('Choose a program');
});

When('you click the next page button', () => {
    cy.get('[data-test="search-pagination-next-page"]')
        .click();
});

Then('you can see the second page of the results', () => {
    cy.get('[data-test="search-results-list"]')
        .should('exist');
    cy.get('[data-test="card-list-item"]')
        .should('have.length.greaterThan', 0);
    cy.get('[data-test="pagination"]')
        .contains('Page 2')
        .should('exist');
});

When('you click the previous page button', () => {
    cy.get('[data-test="search-pagination-previous-page"]')
        .click();
});

And('you can see the first page of the results', () => {
    cy.get('[data-test="search-results-list"]')
        .should('exist');
    cy.get('[data-test="card-list-item"]')
        .should('have.length.greaterThan', 0);
    cy.get('[data-test="pagination"]')
        .contains('Page 1')
        .should('exist');
});

Then('all pagination is disabled', () => {
    cy.get('[data-test="pagination"]')
        .contains('Page 1')
        .should('exist');
});

And('you click search', () => {
    // click outside of the input for the values to be updated
    cy.get('[data-test="d2-section"]')
        .click();

    cy.get('button')
        .contains('Search by attributes')
        .click();
});

And('you reset the program selection', () => {
    cy.get('[data-test="program-selector-container-clear-icon"]')
        .click();
});

And('you select the MNCH PNC program', () => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('MNCH');
    cy.contains('PNC (Adult Woman)')
        .click();
});

Then(/^the user clicks the element containing the text: (.*)$/, (text) => {
    cy.contains(text).click();
});

Then(/^the current url is (.*)$/, (url) => {
    cy.url().should('eq', `${Cypress.config().baseUrl}${url}`);
});

Then(/^the user ?(.*) see the following text: (.*)$/, (not, message) =>
    cy.contains(message).should(not ? 'not.exist' : 'exist'),
);

And('you are navigated to the enrollment dashboard page', () => {
    cy.url().should('include', 'enrollment?');
    cy.url().should('include', 'enrollmentId');
});

And('you are navigated to the enrollment dashboard page without enrollment', () => {
    cy.url().should('include', 'enrollment?');
    cy.url().should('not.include', 'enrollmentId');
    cy.url().should('include', 'teiId');
});

Then('you should see no results found', () => {
    cy.contains('No results found')
        .should('exist');
});

When(/^the user selects the program (.*)$/, (program) => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type(program.slice(0, -1));
    cy.contains(program)
        .click();
});

When(/^the user selects the org unit (.*)$/, (orgUnit) => {
    cy.get('[data-test="org-unit-selector-container"]')
        .click();
    cy.get('[data-test="capture-ui-input"]')
        .type(orgUnit.slice(0, -1));
    cy.contains(orgUnit)
        .click();
});

When(/^you opt in to use the new enrollment Dashboard for (.*)$/, (program) => {
    cy.get('[data-test="main-page-working-list"]').then(($wrapper) => {
        if ($wrapper.find('[data-test="opt-in"]').length > 0) {
            cy.contains('[data-test="dhis2-uicore-button"]', `Opt in for ${program}`).click();
            cy.contains('[data-test="dhis2-uicore-button"]', 'Yes, opt in').click();
            cy.contains('[data-test="dhis2-uicore-button"]', `Opt out for ${program}`);
        }
    });
});

Then(/^you see the opt out component for (.*)$/, (program) => {
    cy.contains('[data-test="dhis2-uicore-button"]', `Opt out for ${program}`);
});

When(/^you opt out to use the new enrollment Dashboard for (.*)$/, (program) => {
    cy.intercept('PUT', '**/dataStore/capture/useNewDashboard').as('optOutEnrollmentDashboard');
    cy.contains('[data-test="dhis2-uicore-button"]', `Opt out for ${program}`).click();
    cy.wait('@optOutEnrollmentDashboard', { timeout: 30000 });
});

Then(/^you see the opt in component for (.*)$/, (program) => {
    cy.contains('[data-test="dhis2-uicore-button"]', `Opt in for ${program}`);
});

And('the data store is clean', () => {
    cy.buildApiUrl('dataStore/capture/useNewDashboard')
        .then(dataStoreUrl =>
            cy.request({ method: 'DELETE', url: dataStoreUrl, failOnStatusCode: false }));
});
