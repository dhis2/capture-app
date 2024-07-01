import { Given, When, Then, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
import moment from 'moment';
import { getCurrentYear } from '../../support/date';

And('you are on the default registration page', () => {
    cy.visit('/#/new');
});

Given('you are in the registration page with Ngelehun CHC org unit selected', () => {
    cy.visit('/#/new?orgUnitId=DiszpKrYNg8');
});

And('there should be informative message explaining you need to select an organisation unit', () => {
    cy.get('[data-test="informative-paper"]')
        .contains('Choose an organisation unit to start reporting')
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
        .contains('Save person')
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
        .contains('Save person')
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
        .contains('Age (years)')
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

And('you select the Antenatal care visit program', () => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('Antenatal care vis');
    cy.contains('Antenatal care visit')
        .click();
});

Then('you see a list of events', () => {
    cy.get('[data-test="event-working-lists"]').within(() => {
        cy.get('[data-test="table-row"]');
    });
});

When('you select one of the events', () => {
    cy.get('[data-test="event-working-lists"]').within(() => {
        cy.get('[data-test="table-row"]').then((rows) => {
            rows[0].click();
        });
    });
});

Then('you are navigated to the Antenatal care visit registration page', () => {
    cy.contains('New Antenatal care visit')
        .should('exist');
});

Then('program and organisation unit is still selected in top bar', () => {
    cy.get('[data-test="scope-selector"]').within(() => {
        cy.contains('Ngelehun CHC')
            .should('exist');
        cy.contains('Antenatal care visit')
            .should('exist');
    });
});

And('you select the Malaria case registration program', () => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
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
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('Inpatient mor');
    cy.contains('Inpatient morbidity and mortality')
        .click();
});

When('you click the Create new button', () => {
    cy.get('[data-test="new-button"]')
        .click();
});

When('you click the first option in split button dropdown', () => {
    cy.get('[data-test="new-button-toggle"]')
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
        .should('eq', `${Cypress.config().baseUrl}/#/new?orgUnitId=DiszpKrYNg8&programId=IpHINAT79UW`);
});

When('you have Child Programme selected', () => {
    cy.get('[data-test="scope-selector"]')
        .contains('Child Programme');
});

And('you select the Contraceptives Voucher Program', () => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('Contraceptives Vouch');
    cy.contains('Contraceptives Voucher Program')
        .click();
});

When('you are navigated to the Contraceptives Voucher Program registration page with program selected', () => {
    cy.url()
        .should('eq', `${Cypress.config().baseUrl}/#/new?orgUnitId=DiszpKrYNg8&programId=kla3mAPgvCH`);
});

And('there should be informative message explaining you need to complete your selections', () => {
    cy.get('[data-test="informative-paper"]')
        .contains('to start reporting')
        .should('exist');
});

And('you select the first category', () => {
    cy.get('[data-test="category-selector-container"]')
        .click();
    cy.get('[data-test="category-filterinput"]')
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

And('you see validation errors', () => {
    cy.contains('A value is required')
        .should('exist');
});

Then('you see validation error on visit date', () => {
    cy.get('[data-test="dataentry-field-occurredAt"]')
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
        .type(`${getCurrentYear()}-01-01`);
});

And('you fill in the hemoglobin', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(1)
        .type('50');
});

And('you are navigated to the working list', () => {
    cy.url()
        .should('include', `${Cypress.config().baseUrl}/#/?orgUnitId=DiszpKrYNg8&programId=lxAQ7Zs9VYR`);

    cy.get('[data-test="event-working-lists"]')
        .contains(`${getCurrentYear()}-01-01`)
        .should('exist');
});

Then('you should see confirm dialog', () => {
    cy.get('[data-test="dhis2-uicore-layer"].translucent').within(() => {
        cy.get('[role="dialog"]')
            .find('[data-test="dhis2-uicore-modaltitle"]')
            .contains('Discard unsaved changes?')
            .should('exist');
        cy.get('[role="dialog"]')
            .find('[data-test="dhis2-uicore-button"]')
            .contains('Yes, discard changes')
            .click();
    });
});

Then(/^you are navigated to the working list with programId (.*)$/, (programId) => {
    cy.url()
        .should('include', `${Cypress.config().baseUrl}/#/?orgUnitId=DiszpKrYNg8&programId=${programId}`);
});

When('you click the cancel button', () => {
    cy.get('[data-test="cancel-button"]')
        .click();
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

And(/^you click the save (.*) submit button$/, (TEType) => {
    cy.contains(`Save ${TEType}`)
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

And('you are in Child programme and Buma MCHP organization unit registration page', () => {
    cy.visit('/#/new?programId=IpHINAT79UW&orgUnitId=AXZq6q7Dr6E');
});

And('you fill the form with age 0', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(9)
        .type(moment().format('YYYY-MM-DD'))
        .blur();
});

And('you see validation warning on birth date', () => {
    cy.get('[data-test="registration-page-content"]')
        .contains('The womans age is outside the normal range. With the birthdate entered, the age would be:')
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

And('you fill in the birth report date', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(7)
        .type('2023-01-01')
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


And('you are in Child programme reenrollment page', () => {
    cy.visit('/#/new?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=EaOyKGOIGRp');
});


And('you see the form prefield with existing TEI attributes values', () => {
    cy.get('[data-test="registration-page-content"]').within(() => {
        cy.contains('New Enrollment in program: Child Programme').should('exist');
        cy.contains('First name').should('exist');
        cy.get('[data-test="capture-ui-input"]').eq(4).should('have.value', 'Anna');
        cy.contains('Last name').should('exist');
        cy.get('[data-test="capture-ui-input"]').eq(5).should('have.value', 'Jones');
        cy.contains('Gender').should('exist');
        cy.contains('Female').should('exist');
    });
});

And('the scope selector has the TEI context', () => {
    cy.get('[data-test="scope-selector"]').within(() => {
        cy.contains('Person').should('exist');
        cy.contains('Anna Jones').should('exist');
    });
});

Given('you are in the Malaria case diagnosis, treatment and investigation program registration page', () => {
    cy.visit('/#/new?programId=qDkgAbB5Jlk&orgUnitId=DiszpKrYNg8');
});

Given('you open the main page with Ngelehun and Malaria case diagnosis, treatment and investigation context', () => {
    cy.visit('/#/?programId=qDkgAbB5Jlk&orgUnitId=DiszpKrYNg8');
});

And('you fill the Malaria case diagnosis registration form with values', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(3)
        .type(`Ana-${Math.round((new Date()).getTime() / 1000)}`)
        .blur();
    cy.get('[data-test="capture-ui-input"]')
        .eq(4)
        .type(`Maria-${Math.round((new Date()).getTime() / 1000)}`)
        .blur();
    cy.get('[data-test="capture-ui-input"]')
        .eq(5)
        .type(moment().add(-1, 'day').format('YYYY-MM-DD'))
        .blur();
});

Then('you see the enrollment event Edit page', () => {
    cy.url().should('include', '/#/enrollmentEventEdit?');
});

And('you fill in multiple Allergies options', () => {
    cy.get('[data-test="registration-page-content"]').within(() => {
        cy.contains('Allergies').should('exist');
    });
    cy.get('[data-test="dhis2-uicore-select-input"]').click();
    cy.get('[data-test="dhis2-uicore-multiselectoption"]').contains('Penicillin and related antibiotics').click();
    cy.get('[data-test="dhis2-uicore-multiselectoption"]').contains('Anticonvulsants').click();
    cy.get('[data-test="dhis2-uicore-multiselectoption"]').contains('Other').click();
    cy.get('[data-test="dhis2-uicore-select-input"]').click({ force: true });
});

Then('you can see the multiple selections in the form', () => {
    cy.get('[data-test="multi-select-field-content"]').within(() => {
        cy.contains('Penicillin and related antibiotics').should('exist');
        cy.contains('Anticonvulsants').should('exist');
        cy.contains('Other').should('exist');
    });
});

Then('the first stage appears on registration page', () => {
    cy.get('[data-test="registration-page-content"]').within(() => {
        cy.contains('Birth - Basic info').should('exist');
        cy.contains('Birth - Details').should('exist');
        cy.contains('Birth - Status').should('exist');
        cy.contains('Report date').should('exist');
        cy.contains('Apgar Score').should('exist');
    });
});

And('you fill the Child Program program registration form with unique values', () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(1)
        .type('2021-01-01')
        .blur();
    cy.get('[data-test="capture-ui-input"]')
        .eq(2)
        .type(20);
    cy.get('[data-test="capture-ui-input"]')
        .eq(3)
        .type(30)
        .blur();
    cy.get('[data-test="capture-ui-input"]')
        .eq(4)
        .type(`Sarah-${Math.round((new Date()).getTime() / 1000)}`)
        .blur();
    cy.get('[data-test="capture-ui-input"]')
        .eq(5)
        .type(`Beth-${Math.round((new Date()).getTime() / 1000)}`)
        .blur();
    cy.get('[data-test="capture-ui-input"]')
        .eq(7)
        .type('2021-01-01')
        .blur();
});

And('you see the enrollment minimap', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('.leaflet-container').should('exist');
    });
});

And('you delete the recently added tracked entity', () => {
    cy.get('[data-test="widget-profile-overflow-menu"]')
        .click();
    cy.contains('Delete Person')
        .click();
    cy.get('[data-test="widget-profile-delete-modal"]').within(() => {
        cy.contains('Yes, delete Person')
            .click();
    });
    cy.url().should('include', 'selectedTemplateId=IpHINAT79UW');
});

And(/^you select (.*) from the available tracked entity types/, (selection) => {
    cy.get('[data-test="dhis2-uicore-select-input"]')
        .click();
    cy.contains(selection)
        .click();
});

And('you click the location button', () => {
    cy.get('[data-test="mapIconButton"]')
        .click();
});

Then('the map opens', () => {
    cy.get('.leaflet-container').should('exist');
});

Given('you are in the Contreceptive Voucher Program registration page', () => {
    cy.visit('/#/new?programId=kla3mAPgvCH&orgUnitId=DiszpKrYNg8');
});

When('the form is prefilled with the selected category combination', () => {
    cy.get('[data-test="dataentry-field-attributeCategoryOptions-LFsZ8v5v7rq"]')
        .contains('AIDSRelief Consortium')
        .should('exist');
});

When('you deselect the category from the form', () => {
    cy.get('[data-test="dataentry-field-attributeCategoryOptions-LFsZ8v5v7rq"]')
        .find('span.Select-clear-zone')
        .click();
});

Then('you see a validation error on category combination', () => {
    cy.get('[data-test="dataentry-field-attributeCategoryOptions-LFsZ8v5v7rq"]')
        .contains('Please select')
        .should('exist');
});
