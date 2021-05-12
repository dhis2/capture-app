import '../sharedSteps';

beforeEach(() => {
    cy.loginThroughForm();
});

And('you are on the default registration page', () => {
    cy.visit('/#/new');
});

And('there should be informative message explaining you need to select an organisation unit', () => {
    cy.get('[data-test="informative-paper"]')
        .contains('Choose a registering unit to start reporting')
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
    cy.get('[data-test="registration-page-content"]')
        .contains('New person')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Profile')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Unique ID')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('First name')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Last name')
        .should('exist');

    cy.get('[data-test="create-and-link-button"]')
        .contains('Save new')
        .should('exist');

    cy.get('[data-test="registration-page-content"]')
        .contains('Saving a person without enrollment in Ngelehun CHC. Enroll in a program by selecting a program from the top bar.')
        .should('exist');
});

And('you see a registration form for the Child Programme', () => {
    cy.get('[data-test="registration-page-content"]')
        .contains('New person in program: Child Programme')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Enrollment')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Date of enrollment')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Date of birth')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Coordinate')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Profile')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Unique ID')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('First name')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Last name')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Gender')
        .should('exist');

    cy.get('[data-test="create-and-link-button"]')
        .contains('Save new')
        .should('exist');

    cy.get('[data-test="registration-page-content"]')
        .contains('Saving a person in Child Programme in Ngelehun CHC.')
        .should('exist');
});

And('you see the registration form for the Malaria case registration', () => {
    cy.get('[data-test="registration-page-content"]')
        .contains('New Malaria case registration')
        .should('exist');

    cy.get('[data-test="registration-page-content"]')
        .contains('Basic info')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Report date')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Coordinate')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Age in years')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Household location')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Status')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Complete event')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Comments')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Write comment')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Relationships')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Add relationship')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Assignee')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Assigned user')
        .should('exist');

    cy.get('[data-test="dhis2-uicore-splitbutton"]')
        .contains('Save and exit')
        .should('exist');

    cy.get('[data-test="registration-page-content"]')
        .contains('Saving to Malaria case registration in Ngelehun CHC')
        .should('exist');
});

And('you select the Malaria case registration program', () => {
    cy.get('.Select')
        .type('Malaria case registr');
    cy.contains('Malaria case registration')
        .click();
});

Then('you see a description text for one section', () => {
    cy.get('[data-test="registration-page-content"]')
        .contains('General characteristics of the patient')
        .should('exist');
});

When('you select the Inpatient morbidity and mortality program', () => {
    cy.get('.Select')
        .type('Inpatient mor');
    cy.contains('Inpatient morbidity and mortality')
        .click();
});

When('you see a dropdown button', () => {
    cy.get('[data-test="new-button"]')
        .contains('New')
        .should('exist');
});

When('you click the "New..." option', () => {
    cy.get('[data-test="new-button"]')
        .click();
    cy.get('[data-test="new-menuitem-two"]')
        .click();
});

When('you click the the first option option', () => {
    cy.get('[data-test="new-button"]')
        .click();
    cy.get('[data-test="new-menuitem-one"]')
        .click();
});

When('you are navigated to the registration page without program selected', () => {
    cy.url()
        .should('eq', `${Cypress.config().baseUrl}/#/new?orgUnitId=DiszpKrYNg8`);
});

When('you are navigated to the Child Programme registration page with program selected', () => {
    cy.url()
        .should('eq', `${Cypress.config().baseUrl}/#/new?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8`);
});

When('you have Child Programme selected', () => {
    cy.get('[data-test="locked-selector"]')
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
        .should('eq', `${Cypress.config().baseUrl}/#/new?programId=kla3mAPgvCH&orgUnitId=DiszpKrYNg8`);
});

And('there should be informative message explaining you need to complete your selections', () => {
    cy.get('[data-test="informative-paper"]')
        .contains('to start reporting')
        .should('exist');
});

And('you select the first category', () => {
    cy.get('.Select')
        .type('AIDSRelief Con');
    cy.contains('AIDSRelief Consortium')
        .click();
});

And('you see the registration form for the specific category', () => {
    cy.get('[data-test="registration-page-content"]')
        .contains('New Contraceptives Voucher Program')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Basic info')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Report date')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Voucher HTC')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Voucher IMCI')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Voucher Implants')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Voucher Injections')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Status')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Complete event')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Comments')
        .should('exist');
    cy.get('[data-test="registration-page-content"]')
        .contains('Write comment')
        .should('exist');

    cy.get('[data-test="dhis2-uicore-splitbutton"]')
        .contains('Save and exit')
        .should('exist');

    cy.get('[data-test="registration-page-content"]')
        .contains('Saving to Contraceptives Voucher Program in Ngelehun CHC')
        .should('exist');
});

// New event in Antenatal care visit
And('you are in the Antenatal care visit registration page', () => {
    cy.visit('/#/new?programId=lxAQ7Zs9VYR&orgUnitId=DiszpKrYNg8');
});

And('you submit the form', () => {
    cy.contains('Save and exit')
        .click();
});

And('you see validation error on visit date', () => {
    cy.get('[data-test="registration-page-content"]')
        .contains('A value is required')
        .should('exist');
});

And('you fill in 200 in the hemoglobin', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(1)
        .type('200');
});

And('you see validation error on hemoglobin', () => {
    cy.get('[data-test="data-entry-container"]')
        .contains('The hemoglobin value cannot be above 99')
        .should('exist');
});

And('you fill in the visit date', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(0)
        .type('2021-01-01');
});

And('you fill in the hemoglobin', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(1)
        .type('50');
});

And('you are navigated to the working list', () => {
    cy.url()
        .should('eq', `${Cypress.config().baseUrl}/#/?programId=lxAQ7Zs9VYR&orgUnitId=DiszpKrYNg8`);

    cy.get('[data-test="event-working-lists"]')
        .contains('2021-01-01')
        .should('exist');
});


// New person
And('you are in the Person registration page', () => {
    cy.visit('/#/new?trackedEntityTypeId=nEenWmSyUEp&orgUnitId=DiszpKrYNg8');
});

And('you fill in the first name with value that has duplicates', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Sarah')
        .blur();
});

And('you fill in a unique first name', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(1)
        .type(`Sarah-${Math.round((new Date()).getTime() / 1000)}`)
        .blur();
});

And('you click the save new submit button', () => {
    cy.contains('Save new')
        .click();
});

Then('you are navigated to the Tracker Capture', () => {
    cy.url().should('include', 'dashboard?tei=');
    cy.url().should('include', 'ou=DiszpKrYNg8&tracked_entity_type=nEenWmSyUEp');
});

Then('you see the possible duplicates modal', () => {
    cy.get('[data-test="duplicates-modal"]')
        .contains('Possible duplicates found')
        .should('exist');
});

Then('you submit the form again from the duplicates modal', () => {
    cy.get('[data-test="create-as-new-person"]')
        .contains('Save as new')
        .click();
});

// New person in WHO RMNCH Tracker
And('you are in the WHO RMNCH program registration page', () => {
    cy.visit('/#/new?programId=WSGAb5XwJ3Y&orgUnitId=DiszpKrYNg8');
});
And('you are in Child programme registration page', () => {
    cy.visit('/#/new?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8');
});

And('you fill the form with age 0', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(9)
        .type('2021-01-01')
        .blur();
});

And('you see validation warning on birth date', () => {
    cy.get('[data-test="registration-page-content"]')
        .contains('The womans age is outside the normal range. With the birthdate entered, the age would be: 0')
        .should('exist');
});

And('you fill the WHO RMNCH program registration form with its required unique values', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(2)
        .type(`Sarah-${Math.round((new Date()).getTime() / 1000)}`);

    cy.get('[data-test="capture-ui-input"]')
        .eq(3)
        .type('Gonzales');

    cy.get('[data-test="capture-ui-input"]')
        .eq(9)
        .type('1992-01-01')
        .blur();
});

And('you fill the WHO RMNCH program registration form with its required values', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(2)
        .type('Ava');

    cy.get('[data-test="capture-ui-input"]')
        .eq(3)
        .type('Didriksson');

    cy.get('[data-test="capture-ui-input"]')
        .eq(9)
        .type('1985-10-01')
        .blur();
});

And('you fill in child programme first name with value that has duplicates', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(4)
        .type('Sarah')
        .blur();
});

Then('you are navigated to the WHO RMNCH program in Tracker Capture app', () => {
    cy.url().should('include', 'dashboard?tei=');
    cy.url().should('include', 'ou=DiszpKrYNg8&program=WSGAb5XwJ3Y');
});

And('you fill the Child programme registration form with a first name with value that has duplicates', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(1)
        .type('2021-01-01')
        .blur();
    cy.get('[data-test="capture-ui-input"]')
        .eq(4)
        .type('Sarah')
        .blur();
});

And('you are in the WNCH PNC program registration page', () => {
    cy.visit('/#/new?programId=uy2gU8kT1jF&orgUnitId=DiszpKrYNg8');
});


And('you see validation errors on the WHO RMNCH program registration page', () => {
    cy.get('[data-test="registration-page-content"]')
        .find('[data-test="error-message"]')
        .should('have.length', 4);
});
