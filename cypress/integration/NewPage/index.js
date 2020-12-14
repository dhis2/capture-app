beforeEach(() => {
    cy.loginThroughForm();
});

And('you are on the default registration page', () => {
    cy.visit('/#/new');
});

And('there should be informative message explaining you need to select an organisation unit', () => {
    cy.get('[data-test="dhis2-capture-informative-paper"]')
        .contains('Choose a registering unit to start reporting')
        .should('exist');
});

And('you select org unit', () => {
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
});

And('you see the dropdown menu for selecting tracked entity type', () => {
    cy.get('[data-test="dhis2-uicore-select"')
        .should('exist');
    cy.contains('You can also choose a program from the top bar and search in that program')
        .should('exist');
});

And('you select tracked entity type person', () => {
    cy.get('[data-test="dhis2-uicore-select"')
        .click();
    cy.get('[data-test="dhis2-uicore-singleselectoption"]')
        .contains('Person')
        .click();
});

And('you see the registration form for the Person', () => {
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('New Person')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('New Person')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Profile')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Unique ID')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('First name')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Last name')
        .should('exist');

    cy.get('[data-test="dhis2-capture-create-and-link-button"]')
        .contains('Save new')
        .should('exist');

    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Saving a person without enrollment in Ngelehun CHC. Enroll in a program by selecting a program from the top bar.')
        .should('exist');
});

And('you see a registration form for the Child Programme', () => {
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('New person in program: Child Programme')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Enrollment')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Date of enrollment')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Date of birth')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Coordinate')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Profile')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Unique ID')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('First name')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Last name')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Gender')
        .should('exist');

    cy.get('[data-test="dhis2-capture-create-and-link-button"]')
        .contains('Save new')
        .should('exist');

    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Saving a person in Child Programme in Ngelehun CHC.')
        .should('exist');
});

And('you see the registration form for the Malaria case registration', () => {
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('New Malaria case registration')
        .should('exist');

    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Basic info')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Report date')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Coordinate')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Age (years)')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Household location')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Status')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Complete event')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Comments')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Write comment')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Relationships')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Add relationship')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Assignee')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Assigned user')
        .should('exist');

    cy.get('[data-test="dhis2-uicore-splitbutton"]')
        .contains('Save an exit')
        .should('exist');

    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Saving to Malaria case registration in Ngelehun CHC')
        .should('exist');
});

And('you select the Child Programme', () => {
    cy.get('.Select')
        .type('Child Program');
    cy.contains('Child Programme')
        .click();
});

And('you select the Malaria case registration program', () => {
    cy.get('.Select')
        .type('Malaria case registr');
    cy.contains('Malaria case registration')
        .click();
});

Given('you are in the main page with no selections made', () => {
    cy.visit('/#/');
    cy.get('[data-test="dhis2-capture-new-event-button"]')
        .should('exist');
});

When('you see a dropdown button', () => {
    cy.get('[data-test="dhis2-capture-new-button"]')
        .contains('New')
        .should('exist');
});

When('you click the "New..." option', () => {
    cy.get('[data-test="dhis2-capture-new-button"]')
        .click();
    cy.get('[data-test="dhis2-capture-new-menuitem-two"]')
        .click();
});

When('you click the the first option option', () => {
    cy.get('[data-test="dhis2-capture-new-button"]')
        .click();
    cy.get('[data-test="dhis2-capture-new-menuitem-one"]')
        .click();
});

When('you are navigated to the registration page without program selected', () => {
    cy.url()
        .should('eq', `${Cypress.config().baseUrl}/#/new/orgUnitId=DiszpKrYNg8`);
});

When('you are navigated to the Child Programme registration page with program selected', () => {
    cy.url()
        .should('eq', `${Cypress.config().baseUrl}/#/new/programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8`);
});

When('you have no program selection', () => {
    cy.get('[data-test="dhis2-capture-program-selector-container"]')
        .contains('Select program');
});

When('you have no program selection', () => {
    cy.get('[data-test="dhis2-capture-locked-selector"]')
        .contains('Select program');
});

When('you have Child Programme selected', () => {
    cy.get('[data-test="dhis2-capture-locked-selector"]')
        .contains('Child Programme');
});

And('you select the Contraceptives Voucher Program', () => {
    cy.get('.Select')
        .type('Contraceptives Vouch');
    cy.contains('Contraceptives Voucher Program')
        .click();
});

When('you are navigated to the Contraceptives Voucher Program registration page with program selected', () => {
    cy.url()
        .should('eq', `${Cypress.config().baseUrl}/#/new/programId=kla3mAPgvCH&orgUnitId=DiszpKrYNg8`);
});

And('there should be informative message explaining you need to complete your selections', () => {
    cy.get('[data-test="dhis2-capture-informative-paper"]')
        .contains('Choose a partner to start reporting')
        .should('exist');
});

And('you select the first partner', () => {
    cy.get('.Select')
        .type('AIDSRelief Con');
    cy.contains('AIDSRelief Consortium')
        .click();
});

And('you see the registration form for the scpecific partner', () => {
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('New Contraceptives Voucher Program')
        .should('exist');

    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Basic info')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Report date')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Voucher HTC')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Voucher IMCI')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Voucher Implants')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Voucher Injections')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Status')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Complete event')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Comments')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Write comment')
        .should('exist');

    cy.get('[data-test="dhis2-uicore-splitbutton"]')
        .contains('Save an exit')
        .should('exist');

    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Saving to Contraceptives Voucher Program in Ngelehun CHC')
        .should('exist');
});
