import { Given, When, Then, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
import '../../sharedSteps';

Given('you are on an enrollment page', () => {
    cy.visit('/#/enrollment?programId=IpHINAT79UW&orgUnitId=UgYg0YW7ZIh&teiId=fhFQhO0xILJ&enrollmentId=gPDueU02tn8');
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Enrollment Dashboard');
});

And('you select the Inpatient morbidity program', () => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('Inpatient morbidi');
    cy.contains('Inpatient morbidity and mortality')
        .click();
});

And('you see the registration form for the Inpatient morbidity program', () => {
    cy.get('[data-test="registration-page-content"]')
        .contains('New Inpatient morbidity and mortality')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Saving to Inpatient morbidity and mortality in Taninahun (Malen) CHP')
        .should('exist');
});

And('you see the registration form for the Malaria case diagnosis', () => {
    cy.get('[data-test="registration-page-content"]')
        .contains('New Enrollment in program: Malaria case diagnosis, treatment and investigation')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Saving a new enrollment in Malaria case diagnosis, treatment and investigation in Taninahun (Malen) CHP.')
        .should('exist');
});

And('you see the registration form for the MNCH PNC program', () => {
    cy.get('[data-test="registration-page-content"]')
        .contains('New Enrollment in program: MNCH / PNC (Adult Woman)')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Saving a new enrollment in MNCH / PNC (Adult Woman) in Taninahun (Malen) CHP.')
        .should('exist');
});

And('you see the working lists for the Inpatient morbidity program', () => {
    cy.get('[data-test="event-working-lists"]')
        .find('tbody')
        .find('tr')
        .should('have.length', 15);
});

And('you select the Malaria case diagnosis program', () => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('Malaria case diag');
    cy.contains('Malaria case diagnosis')
        .click();
});

And('you choose to register a new event program by clicking the link button', () => {
    cy.contains('Create a new event in this program.')
        .click();
});

And('you choose to be navigated to the working list by clicking the link button', () => {
    cy.contains('View working list in this program.')
        .click();
});

And('you choose to enroll a malaria entity by clicking the link button', () => {
    cy.contains('Enroll a new malaria entity in this program.')
        .click();
});

And('you choose to enroll a person by clicking the link button', () => {
    cy.contains('Enroll Carlos Cruz in this program.')
        .click();
});

When(/^you enter enrollment page by typing: (.*)$/, (url) => {
    cy.visit(url);
});


Then(/^you should be redirect to (.*)$/, (expectedUrl) => {
    cy.url()
        .should('eq', `${Cypress.config().baseUrl}/${expectedUrl}`);
});

Given('you land on the enrollment page by having typed only the enrollmentId in the url', () => {
    cy.visit('/#/enrollment?enrollmentId=gPDueU02tn8');
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Enrollment Dashboard');
    cy.contains('[data-test="scope-selector"]', 'Carlos Cruz');
    cy.contains('[data-test="scope-selector"]', 'Taninahun (Malen) CHP');
    cy.contains('1 event');
});

When('you reset the tei selection', () => {
    cy.get('[data-test="person-selector-container-clear-icon"]')
        .click();
});

Then('you are navigated to the main page', () => {
    cy.url().should('include', `${Cypress.config().baseUrl}/#/?orgUnitId=UgYg0YW7ZIh&programId=IpHINAT79UW`);
});

Then('you see message explaining you need to select a program', () => {
    cy.url().should('not.include', 'programId');
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Choose a program to add new or see existing enrollments for Carlos Cruz');
});

When('you reset the org unit selection', () => {
    cy.get('[data-test="org-unit-selector-container-clear-icon"]')
        .click();
});

Then('you see the enrollment page but there is no org unit id in the url', () => {
    cy.url().should('not.include', 'orgUnitId');
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Enrollment Dashboard');
});

When('you reset the enrollment selection', () => {
    cy.get('[data-test="enrollment-selector-container-clear-icon"]')
        .click();
});

Then('you see message explaining you need to select an enrollment', () => {
    cy.url().should('not.include', 'enrollmentId');
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Choose an enrollment to view the dashboard.');
});
