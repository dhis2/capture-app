beforeEach(() => {
    cy.loginThroughForm();
});

Given('you are in the main page with no selections made', () => {
    cy.visit('/#/');
    cy.get('[data-test="dhis2-capture-new-event-button"]')
        .should('exist');
});

When('you click the "New" button to add a new event', () => {
    cy.get('[data-test="dhis2-capture-new-event-button"]')
        .click();
});

When('you click the "New" button to add a new event', () => {
    cy.get('[data-test="dhis2-capture-new-event-button"]')
        .click();
});

When('you click the first option from the "New" button to add a new event', () => {
    cy.get('[data-test="dhis2-capture-new-button"]')
        .click();
    cy.get('[data-test="dhis2-capture-new-menuitem-one"]')
        .click();
});

Then('you should see informative text saying you should do finish your selections', () => {
    cy.get('[data-test="dhis2-capture-informative-paper"]')
        .should('exist');
});

Given('you are in the main page with organisation unit preselected', () => {
    cy.visit('/#/?orgUnitId=DiszpKrYNg8');
    cy.get('[data-test="dhis2-capture-new-event-button"]')
        .should('exist');
});

Then('you should be taken to the new page', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/new?orgUnitId=DiszpKrYNg8`);
});

And('you see the dropdown menu for selecting tracked entity type', () => {
    cy.get('[data-test="dhis2-uicore-singleselect"]')
        .should('exist');
    cy.contains('You can also choose a program from the top bar and create in that program')
        .should('exist');
});

Given('you are in the main page with program preselected', () => {
    cy.visit('/#/?programId=VBqh0ynB2wv');
    cy.get('[data-test="dhis2-capture-new-button"]')
        .should('exist');
});

Given('you select both org unit and program Malaria case registration', () => {
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/?orgUnitId=DiszpKrYNg8`);

    cy.get('.Select')
        .type('Malaria case re');
    cy.contains('Malaria case registration')
        .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/?programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8`);
});

Given('you select both org unit and program Child Programme', () => {
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/?orgUnitId=DiszpKrYNg8`);

    cy.get('.Select')
        .type('Child Program');
    cy.contains('Child Programme')
        .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8`);
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
    cy.url().should('include', 'viewEvent?viewEventId');
});

Given('you land on a main page with an invalid program id', () => {
    cy.visit('/#/?orgUnitId=invalid');
});

Given('you land on a main page with an invalid org unit id', () => {
    cy.visit('/#/?programId=invalid');
});

Then('you should see error message', () => {
    cy.get('[data-test="dhis2-capture-error-message-handler"]')
        .should('exist');
});

Given('you land on a view event page from the url', () => {
    cy.visit('/#/viewEvent?viewEventId=a969f7a3bf1');
});

Given('you are in the new event page with no selections made', () => {
    cy.visit('/#/new');
    cy.get('[data-test="dhis2-capture-informative-paper"]')
        .should('exist');
});

When('you click the cancel button', () => {
    cy.get('[data-test="dhis2-capture-new-page-cancel-button"]')
        .click();
});

Given('you land on a new event page with an invalid program id', () => {
    cy.visit('/#/new?orgUnitId=invalid');
});

Given('you land on a new event page with an invalid org unit id', () => {
    cy.visit('/#/new?programId=invalid');
});

Given('you land on a new event page with preselected org unit', () => {
    cy.visit('/#/new?orgUnitId=DiszpKrYNg8');
});

When('you select program', () => {
    cy.get('.Select')
        .type('Malaria case re');
    cy.contains('Malaria case registration')
        .click();
});

Given('you land on a new event page with preselected program', () => {
    cy.visit('/#/new?programId=VBqh0ynB2wv');
});

When('you select org unit', () => {
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
});

Then('new event page url is valid', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/new?programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8`);
});

Given('you land on a main event page with preselected org unit', () => {
    cy.visit('/#/?orgUnitId=DiszpKrYNg8');
});

When('you select program', () => {
    cy.get('.Select')
        .type('Malaria case re');
    cy.contains('Malaria case registration')
        .click();
});

Given('you land on a main event page with preselected program', () => {
    cy.visit('/#/?programId=VBqh0ynB2wv');
});

When('you select org unit', () => {
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
});

Then('main page page url is valid', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/?programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8`);
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
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/?orgUnitId=DiszpKrYNg8`);
});

Then('you should be taken to the main page with only program selected', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/?programId=VBqh0ynB2wv`);
});

Given('you land on a view event page with an invalid id', () => {
    cy.visit('/#/viewEvent?viewEventId=invalid');
});

When('you click the find button', () => {
    cy.get('[data-test="dhis2-capture-find-button"]')
        .click();
});

When('you click the find button from the dropdown menu', () => {
    cy.get('[data-test="dhis2-capture-find-button"]')
        .click();
    cy.get('[data-test="dhis2-capture-find-menuitem-one"]')
        .click();
});

Then('you navigated to the search page without a program being selected', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/search?orgUnitId=DiszpKrYNg8`);
});

Then('you are navigated to the search page with the same org unit and program Child Programme', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/search?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8`);
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

const selectedChildProgram = ['Selected Program', 'Child Programme'];
const selectedMalariaProgram = ['Selected Program', 'Child Programme'];
const selectedEventProgram = ['Selected Program', 'Antenatal care visit'];
const emptyProgramSelection = ['Program', 'Select program'];
const selectedOrgUnit = ['Selected registering unit', 'Taninahun (Malen) CHP'];
const emptyOrgUnitSelection = ['Registering Organisation Unit'];
const selectedTei = ['Selected', 'Carlos Cruz'];
const selectedEnrollment = ['Selected Enrollment', '2018-08-07 15:47'];
const emptyEnrollmentSelection = ['Enrollment', 'Select...'];

const lockedSelectorCases = {
    all: [...selectedChildProgram, ...selectedOrgUnit, ...selectedTei, ...selectedEnrollment],
    teiAndOrgUnit: [...emptyProgramSelection, ...selectedOrgUnit, ...selectedTei, ...emptyEnrollmentSelection],
    teiAndChildProgram: [...selectedChildProgram, ...emptyOrgUnitSelection, ...selectedTei, ...emptyEnrollmentSelection],
    teiAndMalariaProgram: [...selectedMalariaProgram, ...emptyOrgUnitSelection, ...selectedTei, ...emptyEnrollmentSelection],
    teiAndEventProgram: [...selectedEventProgram, ...emptyOrgUnitSelection, ...selectedTei, ...emptyEnrollmentSelection],
    error: [],
};

Given(/^you land on the enrollment page by having typed the (.*)$/, (url) => {
    cy.visit(url);
});

Then(/^you can see on the locked selector the following (.*)$/, (state) => {
    lockedSelectorCases[state].map(selection => cy.get('[data-test="dhis2-capture-locked-selector"]').contains(selection));
});

Then(/^you see the following (.*)$/, (message) => {
    cy.contains(message);
});

And('you land on the enrollment page by having typed only the enrollmentId on the url', () => {
    cy.visit('/#/enrollment?enrollmentId=gPDueU02tn8');
});

And('you reset the tei selection', () => {
    cy.get('[data-test="reset-selection-button"]')
        .should('have.length.greaterThan', 2);
    cy.get('[data-test="reset-selection-button"]')
        .eq(2)
        .click();
});

And('you navigated to the main page', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/?programId=IpHINAT79UW&orgUnitId=UgYg0YW7ZIh`);
});

And('you reset the program selection', () => {
    cy.get('[data-test="reset-selection-button"]')
        .should('have.length.greaterThan', 2);
    cy.get('[data-test="reset-selection-button"]')
        .eq(0)
        .click();
});

And('you see message explaining you need to select a program', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/enrollment?orgUnitId=UgYg0YW7ZIh&teiId=fhFQhO0xILJ&enrollmentId=gPDueU02tn8`);
    cy.get('[data-test="dhis2-capture-enrollment-page-content"]')
        .contains('Choose program to view more information.');
});

And('you reset the org unit selection', () => {
    cy.get('[data-test="reset-selection-button"]')
        .should('have.length.greaterThan', 2);

    cy.get('[data-test="reset-selection-button"]')
        .eq(1)
        .click();
});

And('you see the enrollment page but there is no org unit id in the url', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/enrollment?programId=IpHINAT79UW&teiId=fhFQhO0xILJ&enrollmentId=gPDueU02tn8`);
    cy.get('[data-test="dhis2-capture-enrollment-page-content"]')
        .contains('Enrollment Dashboard');
});

And('you see the enrollment page', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/enrollment?programId=IpHINAT79UW&orgUnitId=UgYg0YW7ZIh&teiId=fhFQhO0xILJ&enrollmentId=gPDueU02tn8`);
    cy.get('[data-test="dhis2-capture-enrollment-page-content"]')
        .contains('Enrollment Dashboard');
});

And('you reset the enrollment selection', () => {
    cy.get('[data-test="reset-selection-button"]')
        .should('have.length.greaterThan', 2);
    cy.get('[data-test="reset-selection-button"]')
        .eq(3)
        .click();
});

And('you see message explaining you need to select an enrollment', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/enrollment?programId=IpHINAT79UW&orgUnitId=UgYg0YW7ZIh&teiId=fhFQhO0xILJ`);
    cy.get('[data-test="dhis2-capture-enrollment-page-content"]')
        .contains('Choose enrollment to view more information.');
});

And('you select the MNCH PNC program', () => {
    cy.get('.Select').eq(0)
        .type('MNCH');
    cy.contains('PNC (Adult Woman)')
        .click();
});

And('you select the Child Programme', () => {
    cy.get('.Select').eq(0)
        .type('Child Program');
    cy.contains('Child Programme')
        .click();
});

And('you see message explaining there are no enrollments for this program', () => {
    cy.get('[data-test="dhis2-capture-enrollment-page-content"]')
        .contains('There are no enrollments');
});

And('you select the Antenatal care visit', () => {
    cy.get('.Select').eq(0)
        .type('Antenatal care');
    cy.contains('Antenatal care visit')
        .click();
});

And('you see message explaining this is an Event program', () => {
    cy.get('[data-test="dhis2-capture-enrollment-page-content"]')
        .contains('You selected an event program.');
});

