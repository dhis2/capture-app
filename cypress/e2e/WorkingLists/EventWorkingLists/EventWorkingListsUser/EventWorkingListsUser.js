import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { v4 as uuid } from 'uuid';
import '../../sharedSteps';
import { getCurrentYear, combineDataAndYear } from '../../../../support/date';

Given('you open the main page with Ngelehun and malaria case context', () => {
    cy.visit('#/?programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

Then('the default working list should be displayed', () => {
    const rows = combineDataAndYear(getCurrentYear(), {
        '12-30': ['14 Male'],
        '12-29': ['67 Male'],
        '12-27': ['66 Male'],
        '12-25': ['55 Male'],
        '12-24': ['26 Female'],
        '12-21': ['35 Male'],
        '12-19': ['49 Male', '60 Male', '12 Male'],
        '12-16': ['61 Male'],
        '12-13': ['27 Female'],
        '12-12': ['20 Male'],
        '12-06': ['69 Male'],
        '12-04': ['11 Male'],
        '12-03': ['59 Male'],
    });

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row).find('td').first().invoke('text')
                    .then((date) => {
                        const firstArgs = rows[date].length > 1 ?
                            new RegExp(`${rows[date].map(item => item.split(' ')[0]).join('|')}`, 'g')
                            : rows[date][0].split(' ')[0];
                        const secondArgs = rows[date].length > 1 ?
                            new RegExp(`${rows[date].map(item => item.split(' ')[1]).join('|')}`, 'g')
                            : rows[date][0].split(' ')[1];
                        cy.contains(firstArgs)
                            .should('exist');
                        cy.contains(secondArgs)
                            .should('exist');
                    });
            }
        });
});

When('you select the working list called events assigned to anyone', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Events assigned to anyone')
        .click();
});

Then('the list should display events assigned to anyone', () => {
    const rows = [
        '14 Male Milla',
        '67 Male Milla',
        '25 Female Milla',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 4)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[2])
                    .should('exist');
            }
        });
});

Then('the list should display active events that are assigned to anyone', () => {
    const rows = [
        '14 Male Milla',
        '67 Male Milla',
        '25 Female Milla',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 4)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[2])
                    .should('exist');
            }
        });
});

Then('the list should display events where age is between 10 and 20', () => {
    const rows = [
        '14 Male',
        '12 Male',
        '20 Male',
        '11 Male',
        '19 Male',
        '15 Female',
        '14 Male',
        '20 Female',
        '20 Male',
        '18 Male',
        '18 Female',
        '11 Female',
        '10 Male',
        '11 Female',
        '11 Male',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

When('you open the column selector', () => {
    cy.get('[data-test="select-columns-reference"]')
        .click();
});

When('you select Household location and save from the column selector', () => {
    cy.get('aside[role="dialog"]')
        .contains('Household location')
        .parents('tr')
        .find('input[type="checkbox"]')
        .click();

    cy.get('aside[role="dialog"]')
        .contains('Save')
        .click();
});

Then('Household location should display in the list', () => {
    cy.get('[data-test="online-list-table"]')
        .contains('Household location')
        .should('exist');
});

Then('the list should display data for the second page', () => {
    const rows = combineDataAndYear(getCurrentYear(), {
        '12-02': ['19 Male', '56 Female', '61 Male'],
        '11-30': ['9 Male'],
        '11-24': ['15 Female'],
        '11-23': ['2 Male', '55 Female'],
        '11-22': ['14 Male', '8 Female'],
        '11-21': ['70 Male'],
        '11-18': ['22 Male'],
        '11-16': ['4 Male'],
        '11-15': ['2 Male'],
        '11-09': ['28 Female'],
        '11-06': ['44 Male'],
    });


    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row).find('td').first().invoke('text')
                    .then((date) => {
                        const firstArgs = rows[date].length > 1 ?
                            new RegExp(`${rows[date].map(item => item.split(' ')[0]).join('|')}`, 'g')
                            : rows[date][0].split(' ')[0];
                        const secondArgs = rows[date].length > 1 ?
                            new RegExp(`${rows[date].map(item => item.split(' ')[1]).join('|')}`, 'g')
                            : rows[date][0].split(' ')[1];
                        cy.contains(firstArgs)
                            .should('exist');
                        cy.contains(secondArgs)
                            .should('exist');
                    });
            }
        });
});

Then('the list should display 10 rows of data', () => {
    const rows = combineDataAndYear(getCurrentYear(), {
        '12-30': ['14 Male'],
        '12-29': ['67 Male'],
        '12-27': ['66 Male'],
        '12-25': ['55 Male'],
        '12-24': ['26 Female'],
        '12-21': ['35 Male'],
        '12-19': ['49 Male', '60 Male', '12 Male'],
        '12-16': ['61 Male'],
    });

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 11)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row).find('td').first().invoke('text')
                    .then((date) => {
                        const firstArgs = rows[date].length > 1 ?
                            new RegExp(`${rows[date].map(item => item.split(' ')[0]).join('|')}`, 'g')
                            : rows[date][0].split(' ')[0];
                        const secondArgs = rows[date].length > 1 ?
                            new RegExp(`${rows[date].map(item => item.split(' ')[1]).join('|')}`, 'g')
                            : rows[date][0].split(' ')[1];
                        cy.contains(firstArgs)
                            .should('exist');
                        cy.contains(secondArgs)
                            .should('exist');
                    });
            }
        });
});

When('you click the report date column header', () => {
    cy.get('[data-test="dhis2-uicore-tableheadercellaction"]')
        .eq(0)
        .click()
        .click();
});

Then('the list should display data ordered descendingly by report date', () => {
    // For concurrency reasons: Adding a filter to ensure that we don't see data we have added in our tests (the tests will clean up, but concurrent running could cause problems anyway)
    const lastYear = getCurrentYear() - 1;
    cy.contains('button', 'Report date')
        .click();

    cy.get('input[placeholder="From"]')
        .type(`${lastYear}-01-01`);

    cy.get('input[placeholder="To"]').click();

    cy.contains('Update')
        .click({ force: true });

    const rows = combineDataAndYear(lastYear, {
        '01-01': ['14 Female'],
        '01-03': ['63 Male'],
        '01-04': ['4 Female'],
        '01-05': ['37 Male'],
        '01-08': ['68 Female'],
        '01-09': ['27 Male'],
        '01-14': ['45 Female'],
        '01-18': ['9 Male'],
        '01-20': ['59 Male', '50 Female', '62 Female'],
        '01-24': ['66 Male'],
        '01-27': ['42 Female'],
        '01-29': ['51 Female'],
        '02-01': ['1 Female'],
    });

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row).find('td').first().invoke('text')
                    .then((date) => {
                        const firstArgs = rows[date].length > 1 ?
                            new RegExp(`${rows[date].map(item => item.split(' ')[0]).join('|')}`, 'g')
                            : rows[date][0].split(' ')[0];
                        const secondArgs = rows[date].length > 1 ?
                            new RegExp(`${rows[date].map(item => item.split(' ')[1]).join('|')}`, 'g')
                            : rows[date][0].split(' ')[1];
                        cy.contains(firstArgs)
                            .should('exist');
                        cy.contains(secondArgs)
                            .should('exist');
                    });
            }
        });
});

When('you select the working list called Events today', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Events today')
        .click();
});

When('you create a copy of the working list', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Save current view as')
        .click();

    const id = uuid();
    cy.get('[data-test="view-name-content"]')
        .type(id);

    cy.intercept('POST', '**/eventFilters**').as('newEventFilter');

    cy.get('button')
        .contains('Save')
        .click();

    cy.wait('@newEventFilter', { timeout: 30000 });

    cy.reload();

    cy.contains(id.substring(0, 26))
        .click();
});

When('you change the sharing settings', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Share view')
        .click();
    cy.get('[placeholder="Search"]')
        .type('Boateng');

    cy.contains('Kevin Boateng').click();
    cy.contains('Select a level').click();
    cy.get('[data-test="dhis2-uicore-select-menu-menuwrapper"]')
        .contains('View and edit').click({ force: true });

    cy.get('[data-test="dhis2-uicore-button"]').contains('Give access').click({ force: true });
    cy.get('[data-test="dhis2-uicore-button"]').contains('Close').click({ force: true });
});


When('you update the working list', () => {
    cy.get('[data-test="dhis2-uicore-tableheadercellaction"]')
        .eq(0)
        .click()
        .click();

    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Update view')
        .click();
});

Then('your newly defined sharing settings should still be present', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Share view')
        .click();

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
Given('you open the main page with Ngelehun and Inpatient morbidity and mortality context', () => {
    cy.visit('#/?programId=eBAyeGv0exc&orgUnitId=DiszpKrYNg8');
});

When('you set the date of admission filter', () => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
        });

    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Date of admission').click());

    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.get('input[type="text"]')
                .then(($elements) => {
                    cy.wrap($elements[0])
                        .type('2018-01-01');

                    cy.wrap($elements[1])
                        .type('2018-12-31');
                });

            cy.contains('Update')
                .click();
        });
});

When(/^you save the view as (.*)$/, (name) => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Save current view')
        .click();

    cy.get('[data-test="view-name-content"]')
        .type(name);

    cy.intercept('POST', '**/eventFilters**').as('newEventFilter');

    cy.get('button')
        .contains('Save')
        .click();

    cy.wait('@newEventFilter', { timeout: 30000 }).as('newEventResult');
});

When('you refresh the page', () => {
    cy.reload();
});

When('you open the dateFilterWorkingList', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('dateFilterWorkingList')
        .click();
});

Then('the admission filter should be in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Date of admission: 2018-01...')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.get('input[type="text"]')
                .then(($elements) => {
                    cy.wrap($elements[0])
                        .should('have.attr', 'value', '2018-01-01');

                    cy.wrap($elements[1])
                        .should('have.attr', 'value', '2018-12-31');
                });
        });

    // clean up
    cy.get('@newEventResult')
        .then((result) => {
            expect(result.response.statusCode).to.equal(201);
            const id = result.response.body.response.uid;
            cy.buildApiUrl('eventFilters', id)
                .then((eventFiltersUrl) => {
                    cy.request('DELETE', eventFiltersUrl);
                });
        });
});

Given('you open the main page with Ngelehun and Contraceptives Voucher Program', () => {
    cy.visit('#/?orgUnitId=DiszpKrYNg8&programId=kla3mAPgvCH');
});

Then(/^you are told to select (.*)$/, (text) => {
    cy.contains(`Please select ${text}`);
});

When('the user selects CARE International', () => {
    cy.get('[data-test="category-selector-container"]')
        .click();
    cy.get('[data-test="category-filterinput"]')
        .type('CARE Internatio');
    cy.contains('CARE International')
        .click();
});

Then('the working list should be displayed', () => {
    cy.get('[data-test="main-page-working-list"]')
        .find('tr');
});

When('you delete the name toDeleteWorkingList', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();
    cy.contains('Delete view')
        .click();
    cy.intercept('DELETE', '**/eventFilters/**').as('deleteEventFilters');
    cy.get('button')
        .contains('Confirm')
        .click();
    cy.wait('@deleteEventFilters', { timeout: 30000 });
});

Then('the custom events working list is deleted', () => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => {
            cy.contains('toDeleteWorkingList').should('not.exist');
        });
});
