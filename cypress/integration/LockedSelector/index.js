Given('you are in the main page with no selections made', () => {
    cy.visit('/');
    cy.get('[data-test="dhis2-capture-new-button"]')
        .should('exist');
});

When('you click the "New" button to add a new event', () => {
    cy.get('[data-test="dhis2-capture-new-button"]')
        .click();
});

Then('you should see informative text saying you should do finish your selections', () => {
    cy.get('[data-test="dhis2-capture-paper"]')
        .find('[data-test="dhis2-capture-paper-text"]')
        .should('exist');
});

Given('you are in the main page with organisation unit preselected', () => {
    cy.visit('/#/orgUnitId=DiszpKrYNg8');
    cy.get('[data-test="dhis2-capture-new-button"]')
        .should('exist');
});

Given('you are in the main page with program unit preselected', () => {
    cy.visit('/#/orgUnitId=DiszpKrYNg8');
    cy.get('[data-test="dhis2-capture-new-button"]')
        .should('exist');
});

Given('you select both org unit and program Malaria case registration', () => {
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/orgUnitId=DiszpKrYNg8`);

    cy.get('.Select')
        .type('Malaria case re');
    cy.contains('Malaria case registration')
        .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8`);
});

Given('you select both org unit and program Child Programme', () => {
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/orgUnitId=DiszpKrYNg8`);

    cy.get('.Select')
        .type('Child Program');
    cy.contains('Child Programme')
        .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8`);
});

When('you click the "Start again" button', () => {
    cy.get('[data-test="dhis2-capture-start-again-button"]')
        .click();
});

Then('you should be taken to the main page', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/`);
});

Then('you should see the table', () => {
    cy.get('tbody')
        .find('tr')
        .should('exist')
        .its('length')
        .should('eq', 15);
});

Then('you can see the new event page', () => {
    cy.get('[data-test="dhis2-capture-start-again-button"]')
        .should('exist');
});

When('you select the first entity from the table', () => {
    cy.get('tbody')
        .find('tr')
        .first()
        .click();
});

Then('you can see the view event page', () => {
    cy.url().should('include', 'viewEvent/');
});

Given('you land on a main page with an invalid program id', () => {
    cy.visit('/#/orgUnitId=invalid');
});

Given('you land on a main page with an invalid org unit id', () => {
    cy.visit('/#/programId=invalid');
});

Then('you should see error message', () => {
    cy.get('[data-test="dhis2-capture-error-message-handler"]')
        .should('exist');
});

Given('you land on a view event page from the url', () => {
    cy.visit('/#/viewEvent/a969f7a3bf1');
});

Given('you are in the new event page with no selections made', () => {
    cy.visit('/#/newEvent');
    cy.get('[data-test="dhis2-capture-paper"]')
        .find('[data-test="dhis2-capture-paper-text"]')
        .should('exist');
});

When('you click the cancel button', () => {
    cy.get('[data-test="dhis2-capture-new-page-cancel-button"]')
        .click('');
});

Given('you land on a new event page with an invalid program id', () => {
    cy.visit('/#/newEvent/orgUnitId=invalid');
});

Given('you land on a new event page with an invalid org unit id', () => {
    cy.visit('/#/newEvent/programId=invalid');
});

Given('you land on a new event page with preselected org unit', () => {
    cy.visit('/#/newEvent/orgUnitId=DiszpKrYNg8');
});

When('you select program', () => {
    cy.get('.Select')
        .type('Malaria case re');
    cy.contains('Malaria case registration')
        .click();
});

Given('you land on a new event page with preselected program', () => {
    cy.visit('/#/newEvent/programId=VBqh0ynB2wv');
});

When('you select org unit', () => {
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
});

Then('new event page url is valid', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/newEvent/programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8`);
});

Given('you land on a main event page with preselected org unit', () => {
    cy.visit('/#/orgUnitId=DiszpKrYNg8');
});

When('you select program', () => {
    cy.get('.Select')
        .type('Malaria case re');
    cy.contains('Malaria case registration')
        .click();
});

Given('you land on a main event page with preselected program', () => {
    cy.visit('/#/programId=VBqh0ynB2wv');
});

When('you select org unit', () => {
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
});

Then('main page page url is valid', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8`);
});

When('you remove the program selection', () => {
    cy.get('button')
        .find('[class*=ProgramSelector]')
        .click();
});

When('you remove the org unit selection', () => {
    cy.get('button')
        .find('[class*=OrgUnitSelector]').click();
});

Then('you should be taken to the main page with only org unit selected', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/orgUnitId=DiszpKrYNg8`);
});

Then('you should be taken to the main page with only program selected', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/programId=VBqh0ynB2wv`);
});

Given('you land on a view event page with an invalid id', () => {
    cy.visit('/#/viewEvent/invalid');
});

When('you click the find button', () => {
    cy.get('[data-test="dhis2-capture-find-button"]')
        .click();
});

Then('you are navigated to the search page with the same org unit and program Malaria case registration', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/search/programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8`);
});

Then('you are navigated to the search page with the same org unit and program Child Programme', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/search/programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8`);
});

And('there should be search domain Child Programme being preselected', () => {
    cy.get('[data-test="dhis2-capture-search-page-content"]')
        .find('[data-test="dhis2-uicore-select-input"]')
        .contains('Child Programme')
        .should('exist');
});

And('there should be Child Programme domain forms visible to search with', () => {
    cy.get('[data-test="dhis2-capture-search-page-content"]')
        .find('[data-test="capture-ui-input"]')
        .should('have.length', 1);
});

Then('there should be no search domain preselected', () => {
    cy.get('[data-test="dhis2-uicore-select-input"]')
        .should('exist');
    cy.get('[data-test="dhis2-capture-informative-paper"]')
        .should('exist');
});
