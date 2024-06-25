import { Given, When, Then, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
import { v4 as uuid } from 'uuid';
import '../../sharedSteps';
import '../../../sharedSteps';

const cleanUpIfApplicable = (programId) => {
    cy.buildApiUrl(`programStageWorkingLists?filter=program.id:eq:${programId}&fields=id,displayName`)
        .then(url => cy.request(url))
        .then(({ body }) => {
            const workingList = body.programStageWorkingLists && body.programStageWorkingLists.find(e => e.displayName === 'Custom Program stage list');
            if (!workingList) {
                return null;
            }
            return cy
                .buildApiUrl('programStageWorkingLists', workingList.id)
                .then(workingListUrl => cy.request('DELETE', workingListUrl));
        });
};
Given('you open the main page with Ngelehun and child programe context', () => {
    cy.visit('#/?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8');
});

Given('you open the main page with child programe context', () => {
    cy.visit('#/?programId=IpHINAT79UW');
});

Given('you open the main page with Ngelehun and WHO RMNCH Tracker context', () => {
    cy.visit('#/?programId=WSGAb5XwJ3Y&orgUnitId=DiszpKrYNg8');
    cy.get('[data-test="template-selector-create-list"]')
        .click();
});

Given('you open the main page with Ngelehun and Malaria focus investigation context', () => {
    cy.visit('#/?programId=M3xtLkYBlKI&orgUnitId=DiszpKrYNg8');
});

Given('you open the main page with Ngelehun, WHO RMNCH Tracker and First antenatal care visit context', () => {
    cy.visit('#/?programId=WSGAb5XwJ3Y&orgUnitId=DiszpKrYNg8');
    cy.get('[data-test="template-selector-create-list"]')
        .click();

    cy.get('[data-test="tei-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
            cy.contains('Program stage')
                .click();
        });

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('First antenatal care visit')
        .click();

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Given('you open the main page with Ngelehun and Malaria case diagnosis context', () => {
    cy.visit('#/?programId=qDkgAbB5Jlk&orgUnitId=DiszpKrYNg8');
});

Given('you open the main page with Ngelehun and Malaria case diagnosis and Household investigation context', () => {
    cleanUpIfApplicable('qDkgAbB5Jlk');
    cy.visit('#/?programId=qDkgAbB5Jlk&orgUnitId=DiszpKrYNg8');

    cy.get('[data-test="tei-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
            cy.contains('Program stage')
                .click();
        });

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Household investigation')
        .click();

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Given('you open a clean main page with Ngelehun and Malaria focus investigation context', () => {
    cleanUpIfApplicable('M3xtLkYBlKI');
    cy.visit('#/?programId=M3xtLkYBlKI&orgUnitId=DiszpKrYNg8');
});

Then('the default working list should be displayed', () => {
    const names = [
        'Filona',
        'Gertrude',
        'Frank',
        'Maria',
        'Joe',
        'Anthony',
        'Alan',
        'Heather',
        'Andrea',
        'Donald',
        'Frances',
        'Julia',
        'Elizabeth',
        'Donald',
        'Wayne',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1])
                    .should('exist');
            }
        });
});

When('you select the working list called completed enrollments', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Completed enrollments')
        .click();
});

Then('the list should display teis with a completed enrollment', () => {
    const names = [
        'Filona Ryder',
        'Gertrude Fjordsen',
        'Frank Fjordsen',
        'Emma Johnson',
        'Alan Thompson',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 6)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

Then('the enrollment status filter button should show that the completed filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Enrollment status: Completed')
        .should('exist');
});

When('you set the enrollment status filter to completed', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Enrollment status')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Completed')
        .click();
});

When('you set the enrollment date to a relative range', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Enrollment date')
        .click();
    cy.get('[data-test="date-range-filter-start"]')
        .type('1000');
    cy.get('[data-test="date-range-filter-end"]')
        .type('1000');
});

When('you set the event status filter to completed', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Event status')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Completed')
        .click();
});

When('you set the WHOMCH Smoking filter to No', () => {
    cy.get('[data-test="tei-working-lists"]')
        .within(() => {
            cy.get('[data-test="more-filters"]').eq(1)
                .click();
            cy.contains('WHOMCH Smoking')
                .click();
        });

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('No')
        .click();
});

When('you set the assginee filter to none', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Assigned to')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('None')
        .click();
});

Then('the assignee filter button should show that unassigned filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Assigned to: None')
        .should('exist');
});

Then('the list should display teis with an active enrollment and unassinged events', () => {
    const ids = [
        'ZDA984904',
        'FSL05494',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 3)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(ids[index - 1])
                    .should('exist');
            }
        });
});

Then('the list should display teis with John as the first name', () => {
    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 4)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains('John')
                    .should('exist');
            }
        });
});


When('you open the column selector', () => {
    cy.get('[data-test="select-columns-reference"]')
        .click();
});

When('you select the organisation unit and save from the column selector', () => {
    cy.get('aside[role="dialog"]')
        .contains('Organisation unit')
        .find('input')
        .click();

    cy.get('aside[role="dialog"]')
        .contains('Save')
        .click();
});

Then('the organisation unit should display in the list', () => {
    cy.get('[data-test="online-list-table"]')
        .contains('Organisation unit')
        .should('exist');
});

Then('the list should display data for the second page', () => {
    const names = [
        'Johnny',
        'Donna',
        'Sharon',
        'Scott',
        'Tom',
        'Emma',
        'Alan',
        'Anna',
        'Jack',
        'Tim',
        'James',
        'Noah',
        'Emily',
        'Lily',
        'Olvia',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[0])
                    .should('exist');
            }
        });
});

Then('the list should display 10 rows of data', () => {
    const names = [
        'Filona',
        'Gertrud',
        'Frank',
        'Maria',
        'Joe',
        'Anthony',
        'Alan',
        'Heather',
        'Andrea',
        'Donald',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 11)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[0])
                    .should('exist');
            }
        });
});

When('you click the first name column header', () => {
    cy.get('[data-test="dhis2-uicore-tableheadercellaction"]')
        .eq(0)
        .click();
});

When('you click the last name column header', () => {
    cy.get('[data-test="dhis2-uicore-tableheadercellaction"]')
        .eq(2)
        .click();
});

When('you click the WHOMCH Hemoglobin value column header', () => {
    cy.get('[data-test="dhis2-uicore-tableheadercellaction"]')
        .last()
        .click()
        .click();
});

Then('the list should display data ordered ascendingly by first name', () => {
    const names = [
        'Alan',
        'Alan',
        'Andrea',
        'Anna',
        'Anthony',
        'Donald',
        'Donald',
        'Donna',
        'Elizabeth',
        'Emily',
        'Emma',
        'Emma',
        'Evelyn',
        'Filona',
        'Frances',
        'John',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1])
                    .should('exist');
            }
        });
});

Then('the list should display data ordered ascendingly by last name', () => {
    const names = [
        'Hertz',
        'Siren',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 3)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1])
                    .should('exist');
            }
        });
});

Then('the list should display data ordered descending by WHOMCH Hemoglobin', () => {
    const names = [
        'Hertz',
        'Siren',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 3)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1])
                    .should('exist');
            }
        });
});

Then('you see the custom TEI working lists', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .within(() => {
            cy.contains('Events assigned to me').should('exist');
            cy.contains('Cases not yet assigned').should('exist');
            cy.contains('Ongoing foci responses').should('exist');
        });
});

When('you save the list with the name My custom list', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();
    cy.contains('Save current view')
        .click();
    cy.get('[data-test="view-name-content"]')
        .type('My custom list');

    cy.intercept('POST', '**/trackedEntityInstanceFilters**').as('newTrackedEntityInstanceFilters');
    cy.get('button')
        .contains('Save')
        .click();
    cy.wait('@newTrackedEntityInstanceFilters', { timeout: 30000 });
});

When('you save the list with the name Custom Program stage list', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();
    cy.contains('Save current view')
        .click();
    cy.get('[data-test="view-name-content"]')
        .type('Custom Program stage list');

    cy.intercept('POST', '**/programStageWorkingLists**').as('newProgramStageWorkingLists');
    cy.get('button')
        .contains('Save')
        .click();
    cy.wait('@newProgramStageWorkingLists', { timeout: 30000 });
});

When('you update the list with the name My custom list', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.intercept('PUT', '**/trackedEntityInstanceFilters/**').as('editTrackedEntityInstanceFilters');
    cy.contains('Update view')
        .click();
    cy.wait('@editTrackedEntityInstanceFilters', { timeout: 30000 });
});

When('you update the list with the name Custom Program stage list', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.intercept('PUT', '**/programStageWorkingLists/**').as('editProgramStageWorkingLists');
    cy.contains('Update view')
        .click();
    cy.wait('@editProgramStageWorkingLists', { timeout: 30000 });
});

Then(/^you can load the view with the name ?(.*)/, (name) => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .within(() => {
            cy.contains(name).click();
        });
});

When('you delete the name My custom list', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();
    cy.contains('Delete view')
        .click();

    cy.intercept('DELETE', '**/trackedEntityInstanceFilters/**').as('deleteTrackedEntityInstanceFilters');
    cy.get('button')
        .contains('Confirm')
        .click();
    cy.wait('@deleteTrackedEntityInstanceFilters', { timeout: 30000 });
});

When('you delete the name Custom Program stage list', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();
    cy.contains('Delete view')
        .click();

    cy.intercept('DELETE', '**/programStageWorkingLists/**').as('deleteProgramStageWorkingLists');
    cy.get('button')
        .contains('Confirm')
        .click();
    cy.wait('@deleteProgramStageWorkingLists', { timeout: 30000 });
});

Then(/^the new ?(.*) is created/, (name) => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .within(() => {
            cy.contains(name).should('exist');
        });
});

Then(/^the ?(.*) is deleted/, (name) => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .within(() => {
            cy.contains(name).should('not.exist');
        });
});

When('you change the sharing settings', () => {
    cy.get('[data-test="list-view-menu-button"]').click();
    cy.contains('Share view').click();
    cy.get('[placeholder="Search"]')
        .type('Boateng');

    cy.contains('Kevin Boateng').click();
    cy.contains('Select a level').click();
    cy.get('[data-test="dhis2-uicore-popper"]').contains('View and edit').click({ force: true });
    cy.get('[data-test="dhis2-uicore-button"]').contains('Give access').click({ force: true });
    cy.get('[data-test="dhis2-uicore-button"]').contains('Close').click({ force: true });
});

Then('you see the new sharing settings', () => {
    cy.get('[data-test="list-view-menu-button"]').click();
    cy.contains('Share view').click();
    cy.contains('Kevin Boateng')
        .should('exist');

    cy.contains('Close')
        .click();

    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Delete view')
        .click();

    cy.contains('Confirm')
        .click();
});

When('you create a copy of the working list',
    () => {
        cy.get('[data-test="list-view-menu-button"]')
            .click();

        cy.contains('Save current view as')
            .click();

        const id = uuid();
        cy.get('[data-test="view-name-content"]')
            .type(id);

        cy.intercept('POST', '**/trackedEntityInstanceFilters**')
            .as('newTrackerFilter');

        cy.get('[data-test="new-template-dialog"]')
            .within(() => {
                cy.get('[data-test="dhis2-uicore-button"]')
                    .contains('Save')
                    .click();
            });

        cy.wait('@newTrackerFilter', { timeout: 30000 });
        cy.url({ timeout: 30000 }).should('not.include', 'selectedTemplateId=PpGINOT00UX');

        cy.reload();
    });

When('you open the program stage filters from the more filters dropdown menu', () => {
    cy.get('[data-test="tei-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
            cy.contains('Program stage')
                .click();
        });
});

Then('you see the program stages and the default events filters', () => {
    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Birth');
    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Baby Postnatal');
    cy.get('[data-test="filter-button-container-programStage"]')
        .should('exist');
    cy.get('[data-test="filter-button-container-occurredAt"]')
        .should('exist');
    cy.get('[data-test="filter-button-container-status"]')
        .should('exist');
});

When('you select the First antenatal care visit program stage', () => {
    cy.get('[data-test="list-view-filter-contents"]')
        .contains('First antenatal care visit')
        .click();
});

When('you select the Foci response program stage', () => {
    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Foci response')
        .click();
});

When('you select a data element columns and save from the column selector', () => {
    cy.get('aside[role="dialog"]')
        .contains('People included')
        .find('input')
        .click();

    cy.get('aside[role="dialog"]')
        .contains('Save')
        .click();
});

Then('you see data elements specific filters and columns', () => {
    cy.get('[data-test="filter-button-container-DX4LVYeP7bw"]')
        .should('exist');
    cy.get('[data-test="tei-working-lists"]')
        .should('exist');
});

Then('the list should display 1 row of data', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Enrollment status: Active')
        .should('exist');
    cy.get('[data-test="tei-working-lists"]')
        .contains('Event status: Completed')
        .should('exist');
    cy.get('[data-test="tei-working-lists"]')
        .contains('First name: Urzula')
        .should('exist');
    cy.get('[data-test="tei-working-lists"]')
        .contains('WHOMCH Smoking: No')
        .should('exist');

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 2);
    cy.get('[data-test="tei-working-lists"]')
        .find('table')
        .contains('Urzula')
        .should('exist');
});

Then(/^you ?(.*) see program stage working list events/, (not) => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('WHOMCH Smoking')
        .should(not ? 'not.exist' : 'exist');
});

When('you remove the program stage filter', () => {
    cy.get('[data-test="filter-button-container-programStage"]')
        .click();
    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Remove filter')
        .click();
});

Then('you see scheduledAt filter', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Appointment date')
        .should('exist');
});

When('you select a scheduledAt column and save from the column selector', () => {
    cy.get('aside[role="dialog"]')
        .contains('Appointment date')
        .find('input')
        .click();

    cy.get('aside[role="dialog"]')
        .contains('Save')
        .click();
});

When('you select the events scheduled today', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Appointment date')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Today')
        .click();
});

Then('you see the selected option in the scheduledAt filter', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Appointment date: Today')
        .should('exist');
});

Then('you are redirect to the default templete', () => {
    cy.url().should('include', '-default');
});

Then('the TEI working list initial configuration was kept', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Enrollment status: Active')
        .should('exist');
    cy.get('[data-test="tei-working-lists"]')
        .find('[data-test="more-filters"]')
        .should('have.length', 2);
});

And('you change the org unit', () => {
    cy.get('[data-test="org-unit-selector-container"]')
        .click();
    cy.get('[data-test="capture-ui-input"]')
        .type('Njandama MCHP');
    cy.contains('Njandama MCHP')
        .click();
});

Then('the working list configuration was kept', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Event status: Completed')
        .should('exist');
});

Then('the program stage custom working list filters are loaded', () => {
    cy.get('[data-test="tei-working-lists"]')
        .find('[data-test="more-filters"]')
        .should('have.length', 2);
});

Given('you open the main page with Ngelehun and WHO RMNCH Tracker context and configure a program stage working list', () => {
    cy.visit('#/?programId=WSGAb5XwJ3Y&orgUnitId=DiszpKrYNg8');
    cy.get('[data-test="template-selector-create-list"]')
        .click();

    cy.get('[data-test="tei-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
            cy.contains('Program stage')
                .click();
        });

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Postpartum care visit')
        .click();

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Given('you open the main page with all accesible records in the WHO RMNCH Tracker context and configure a program stage working list', () => {
    cy.visit('#/?programId=WSGAb5XwJ3Y&all');

    cy.get('[data-test="tei-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
            cy.contains('Program stage')
                .click();
        });

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Postpartum care visit')
        .click();

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Then('the tracker event URL contains the orgUnitId', () => {
    cy.url().should('include', '/enrollmentEventEdit?eventId=cxQ44Gz8yEr&orgUnitId=yMCshbaVExv');
});

When('you open an enrollment event from the working list', () => {
    cy.contains('Sara')
        .click();
});

When('you go back using the browser button', () => {
    cy.go('back');
});

Then('the program stage working list is loaded', () => {
    cy.get('[data-test="tei-working-lists"]')
        .find('[data-test="more-filters"]')
        .should('have.length', 2);

    cy.get('[data-test="tei-working-lists"]')
        .contains('WHOMCH Hemoglobin value')
        .should('exist');
});

And('you open the menu and click the "Download data..." button', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();
    cy.contains('Download data...')
        .click();
});

And('you open the menu', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();
});

Then('the "Download data..." button is hidden', () => {
    cy.contains('Download data...')
        .should('not.exist');
});

Then('the download dialog opens', () => {
    cy.get('[data-test="working-lists-download-dialog"]')
        .within(() => {
            cy.contains('Download with current filters');
        });
});

Then('the CSV button exists', () => {
    const params = 'order=createdAt%3Adesc&orgUnit=DiszpKrYNg8&ouMode=SELECTED&program=IpHINAT79UW&fields=%3Aall%2C%21relationships%2CprogramOwners%5BorgUnit%2Cprogram%5D&skipPaging=true';
    cy.get('[data-test="working-lists-download-dialog"]')
        .within(() => {
            cy.contains('Download as CSV');

            cy.get('a')
                .eq(1)
                .should('have.attr', 'href').and('include', `/trackedEntities.csv?${params}`);
        });
});

Then('the JSON button exists', () => {
    const params = 'order=createdAt%3Adesc&orgUnit=DiszpKrYNg8&ouMode=SELECTED&program=IpHINAT79UW&fields=%3Aall%2C%21relationships%2CprogramOwners%5BorgUnit%2Cprogram%5D&skipPaging=true';
    cy.get('[data-test="working-lists-download-dialog"]')
        .within(() => {
            cy.contains('Download as JSON');

            cy.get('a')
                .eq(0)
                .should('have.attr', 'href').and('include', `/trackedEntities.json?${params}`);
        });
});

When('you set the event visit date to Today', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Date of visit')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Today')
        .click();
});

Then('the working list is empty', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('No items to display')
        .click();
});
