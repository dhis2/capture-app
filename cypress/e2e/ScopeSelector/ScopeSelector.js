import { Given, When, Then, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
import { getCurrentYear } from '../../support/date';

Given(/^you land on a enrollment page domain by having typed (.*)$/, (url) => {
    cy.visit(url);
    cy.get('[data-test="person-selector-container"]').contains('Person');
});

Given(/^you land on a enrollment page domain in Malaria focus investigation by having typed (.*)$/, (url) => {
    cy.visit(url);
    cy.get('[data-test="focus area-selector-container"]').contains('Focus area');
});

When('you click the "New" button to add a new event', () => {
    cy.get('[data-test="new-event-button"]')
        .click();
});

When('you click the first option from the "New" button to add a new event', () => {
    cy.get('[data-test="new-button-toggle"]')
        .click();
    cy.get('[data-test="new-menuitem-one"]')
        .click();
});

Then('you should see informative text saying you should do finish your selections', () => {
    cy.get('[data-test="informative-paper"]')
        .should('exist');
});

Given('you are in the main page with organisation unit preselected', () => {
    cy.visit('/#/?orgUnitId=DiszpKrYNg8');
    cy.get('[data-test="org-unit-selector-container"]').contains('Ngelehun CHC');
    cy.get('[data-test="new-event-button"]')
        .should('exist');
});

Then('you should be taken to the new page', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/new?orgUnitId=DiszpKrYNg8`);
});

Given('you are in the main page with program preselected', () => {
    cy.visit('/#/?programId=VBqh0ynB2wv');
    cy.get('[data-test="program-selector-container"]').contains('Malaria case registration');
    cy.get('[data-test="new-button"]')
        .should('exist');
});

Given('you select both org unit and program Malaria case registration', () => {
    cy.get('[data-test="org-unit-selector-container"]')
        .click();
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/?orgUnitId=DiszpKrYNg8`);

    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('Malaria case re');
    cy.contains('Malaria case registration')
        .click();
    cy.url().should('include', `${Cypress.config().baseUrl}/#/?orgUnitId=DiszpKrYNg8&programId=VBqh0ynB2wv`);
});

Given('you select both org unit and program Child Programme', () => {
    cy.get('[data-test="org-unit-selector-container"]')
        .click();
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/?orgUnitId=DiszpKrYNg8`);

    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('Child Program');
    cy.contains('Child Programme')
        .click();
    cy.url().should('include', `${Cypress.config().baseUrl}/#/?orgUnitId=DiszpKrYNg8&programId=IpHINAT79UW`);
});

When('you click the "Start again" button', () => {
    cy.contains('Clear selections')
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
    cy.contains('Clear selections')
        .click();
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
    cy.forceVisit('/#/?programId=invalid');
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/?programId=invalid`);
});

Given('you land on a main page with an invalid org unit id', () => {
    cy.forceVisit('/#/?orgUnitId=invalid');
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/?orgUnitId=invalid`);
});

Then('you should see error message', () => {
    cy.get('[data-test="error-message-handler"]')
        .should('exist');
});

Given('you land on a view event page from the url', () => {
    cy.visit('/#/viewEvent?viewEventId=a969f7a3bf1');
});

Given('you are in the new event page with no selections made', () => {
    cy.visit('/#/new');
    cy.get('[data-test="informative-paper"]')
        .should('exist');
});

When('you click the cancel button', () => {
    cy.get('[data-test="new-page-cancel-button"]')
        .click();
});

Given('you land on a new event page with an invalid program id', () => {
    cy.forceVisit('/#/new?programId=invalid');
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/new?programId=invalid`);
});

Given('you land on a new event page with an invalid org unit id', () => {
    cy.forceVisit('/#/new?orgUnitId=invalid');
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/new?orgUnitId=invalid`);
});

Given('you land on a new event page with preselected org unit', () => {
    cy.visit('/#/new?orgUnitId=DiszpKrYNg8');
});

Given('you land on a new event page with preselected program', () => {
    cy.visit('/#/new?programId=VBqh0ynB2wv');
});


Then('new event page url is valid', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/new?orgUnitId=DiszpKrYNg8&programId=VBqh0ynB2wv`);
});

Given('you land on a main event page with preselected org unit', () => {
    cy.visit('/#/?orgUnitId=DiszpKrYNg8');
});

When('you select program', () => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('Malaria case re');
    cy.contains('Malaria case registration')
        .click();
});

Given('you land on a main event page with preselected program', () => {
    cy.visit('/#/?programId=VBqh0ynB2wv');
});

Then('main page page url is valid', () => {
    cy.url().should('include', `${Cypress.config().baseUrl}/#/?orgUnitId=DiszpKrYNg8&programId=VBqh0ynB2wv`);
});

When('you remove the program selection', () => {
    cy.get('[data-test="program-selector-container-clear-icon"]')
        .click();
});

When('you remove the org unit selection', () => {
    cy.get('[data-test="org-unit-selector-container-clear-icon"]')
        .click();
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
    cy.get('[data-test="find-button"]')
        .click();
});

When('you click the find button from the dropdown menu', () => {
    cy.get('[data-test="find-button"]')
        .click();
    cy.get('[data-test="find-menuitem-one"]')
        .click();
});

Then('you navigated to the search page without a program being selected', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/search?orgUnitId=DiszpKrYNg8`);
});

Then('you are navigated to the search page with the same org unit and program Child Programme', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/search?orgUnitId=DiszpKrYNg8&programId=IpHINAT79UW`);
});

const selectedChildProgram = ['Program', 'Child Programme'];
const selectedMalariaProgram = ['Program', 'Malaria case diagnosis'];
const selectedEventProgram = ['Program', 'Antenatal care visit'];
const emptyProgramSelection = ['Program', 'Choose a program'];
const selectedOrgUnit = ['Organisation unit', 'Taninahun (Malen) CHP'];
const emptyOrgUnitSelection = ['Choose an organisation unit'];
const selectedTei = ['Person', 'Carlos Cruz'];
const selectedEnrollment = ['Enrollment', `${getCurrentYear() + 1}-07-01 12:05`];

const scopeSelectorCases = {
    all: [...selectedChildProgram, ...selectedOrgUnit, ...selectedTei, ...selectedEnrollment],
    teiAndOrgUnit: [...emptyProgramSelection, ...selectedOrgUnit, ...selectedTei],
    teiAndChildProgram: [...selectedChildProgram, ...emptyOrgUnitSelection, ...selectedTei],
    teiAndMalariaProgram: [...selectedMalariaProgram, ...emptyOrgUnitSelection, ...selectedTei],
    teiAndEventProgram: [...selectedEventProgram, ...emptyOrgUnitSelection, ...selectedTei],
    error: [],
};

Given(/^you land on the enrollment page by having typed the (.*)$/, (url) => {
    cy.visit(url);
});

Then(/^you can see on the scope selector the following (.*)$/, (state) => {
    scopeSelectorCases[state].map(selection => cy.get('[data-test="scope-selector"]').contains(selection));
});

Then(/^you see the following (.*)$/, (message) => {
    cy.contains(message);
});

And('you land on the enrollment page by having typed only the enrollmentId on the url', () => {
    cy.visit('/#/enrollment?enrollmentId=gPDueU02tn8');
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Enrollment Dashboard');
});

And('you reset the tei selection', () => {
    cy.get('[data-test="person-selector-container-clear-icon"]')
        .click();
});

And('you navigated to the main page', () => {
    cy.url().should('include', `${Cypress.config().baseUrl}/#/?orgUnitId=UgYg0YW7ZIh&programId=IpHINAT79UW`);
});

And('you see message explaining you need to select a program', () => {
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Choose a program to add new or see existing enrollments for Carlos Cruz');
});

And('you reset the org unit selection', () => {
    cy.get('[data-test="org-unit-selector-container-clear-icon"]')
        .click();
});

And('you see the enrollment event Edit page but there is no org unit id in the url', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/enrollmentEventEdit?eventId=lQQyjR73hHk`);
    cy.contains('Enrollment: View Event');
});

And('you see the enrollment event New page but there is no org unit id in the url', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/enrollmentEventNew?enrollmentId=gPDueU02tn8&programId=IpHINAT79UW&stageId=A03MvHHogjR&teiId=fhFQhO0xILJ`);
    cy.contains('Choose an organisation unit to start reporting');
});

And('you see the enrollment event New page but there is no stage id in the url', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/enrollmentEventNew?enrollmentId=gPDueU02tn8&orgUnitId=UgYg0YW7ZIh&programId=IpHINAT79UW&teiId=fhFQhO0xILJ`);
    cy.contains('Enrollment: New Event');
});

And('you see the enrollment page', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/enrollment?enrollmentId=gPDueU02tn8&orgUnitId=UgYg0YW7ZIh&programId=IpHINAT79UW&teiId=fhFQhO0xILJ`);
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Enrollment Dashboard');
});

And('you reset the enrollment selection', () => {
    cy.get('[data-test="enrollment-selector-container-clear-icon"]')
        .click();
});

And('you reset the stage selection', () => {
    cy.get('[data-test="stage-selector-container-clear-icon"]')
        .click();
});

And('you reset the event selection', () => {
    cy.get('[data-test="report date-selector-container-clear-icon"]')
        .click();
});

And('you see message explaining you need to select an enrollment', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/enrollment?orgUnitId=UgYg0YW7ZIh&programId=IpHINAT79UW&teiId=fhFQhO0xILJ`);
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Choose an enrollment to view the dashboard.');
});

And('you select the Child Programme', () => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('Child Program');
    cy.contains('Child Programme')
        .click();
});

And('you see message explaining there are no enrollments for this program', () => {
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Carlos Cruz is not enrolled in this program.');
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Enroll Carlos Cruz in this program.');
});

And('you select the Antenatal care visit', () => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('Antenatal care');
    cy.contains('Antenatal care visit')
        .click();
});

And('you see message explaining this is an Event program', () => {
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Antenatal care visit is an event program and does not have enrollments.');
});

When('you select org unit that is incompatible with the already selected program', () => {
    cy.get('[data-test="org-unit-selector-container"]')
        .click();
    cy.get('[data-test="capture-ui-input"]')
        .type('Biriw');
    cy.contains('Biriwa')
        .click();
});

Then('you can see message on the scope selector', () => {
    cy.get('[data-test="error-message-handler"]')
        .contains('Selected program is invalid for selected organisation unit');
    cy.get('[data-test="program-selector-container-clear-icon"]')
        .click();
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-selector-no-programs"]')
        .contains('Show all');
});

Then('you see the tei id on the scope selector', () => {
    cy.get('[data-test="scope-selector"]').contains('dNpxRu1mWG5');
});
