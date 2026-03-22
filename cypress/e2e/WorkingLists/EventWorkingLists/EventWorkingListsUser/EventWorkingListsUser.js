import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { v4 as uuid } from 'uuid';
import '../sharedSteps';
import { combineDataAndYear, getCurrentYear } from '../../../../support/date';

const CONTEXT_QUERIES = {
    'malaria case context': 'programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8',
    'Inpatient morbidity and mortality context': 'programId=eBAyeGv0exc&orgUnitId=DiszpKrYNg8',
    'Contraceptives Voucher Program': 'orgUnitId=DiszpKrYNg8&programId=kla3mAPgvCH',
    'event program text filter context': 'programId=MoUd5BTQ3lY&orgUnitId=DiszpKrYNg8',
};

Given(/^you open the main page with Ngelehun and (.+)$/, (contextOrPath) => {
    const query = CONTEXT_QUERIES[contextOrPath] ?? contextOrPath;
    cy.visit(`#/?${query}`);
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
                cy.wrap($row).find('td').eq(1).invoke('text')
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

When('you set the Household location filter to Is empty', () => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
        });

    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Household location').click());

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Is empty')
        .click();
});

Then('the Household location filter button should show that the filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Household location: Is empty')
        .should('exist');
});

Then('the age filter button should show that the filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains(/Age \(years\): \d+ to \d+/)
        .should('exist');
});

When(/^you set the text filter "([^"]+)" to "([^"]+)"$/, (filterName, value) => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => {
            cy.contains('More filters').click();
        });
    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains(filterName).click());
    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[type="text"]')
        .clear()
        .type(value)
        .blur();
    cy.get('[data-test="list-view-filter-apply-button"]').click();
});

Then(/^the text filter "([^"]+)" should be in effect and show "([^"]+)" when opened$/, (filterName, value) => {
    cy.get('[data-test="event-working-lists"]').contains(`${filterName}: ${value}`).should('exist');
    cy.get('[data-test="event-working-lists"]').contains(filterName).click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.get('input[type="text"]').should('have.value', value);
    });
    cy.get('body').click(0, 0);
});

Then('the Household location filter should show Is empty checked', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Household location')
        .click();
    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.contains('Is empty')
                .closest('label')
                .find('input[type="checkbox"]')
                .should('be.checked');
        });
    cy.get('body').click(0, 0);
});

Then('the list should display one record', () => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => {
            cy.get('[data-test="working-list-table-loading"]').should('not.exist');
        });
    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 2);
});

Then('the list should display one record with empty Household location', () => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => {
            cy.get('[data-test="working-list-table-loading"]').should('not.exist');
        });
    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 2);
    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .eq(1)
        .within(() => {
            cy.get('td').contains('Lat:').should('not.exist');
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
                cy.wrap($row).find('td').eq(1).invoke('text')
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
                cy.wrap($row).find('td').eq(1).invoke('text')
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

    cy.contains('Absolute range')
        .click();

    cy.get('input[placeholder="From"]')
        .type(`${lastYear}-01-01`).blur();

    cy.get('input[placeholder="To"]').click().blur();

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
                cy.wrap($row).find('td').eq(1).invoke('text')
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
        .within(() => {
            cy.get('input[type="text"]')
                .type(id)
                .blur();
        });

    cy.intercept('POST', '**/eventFilters**').as('newEventFilter');

    cy.get('button')
        .contains('Save')
        .click();

    cy.wait('@newEventFilter', { timeout: 30000 });

    cy.reload();

    cy.contains(id.substring(0, 26))
        .click();
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

    cy.get('[data-test="sharing-dialog"]').within(() => {
        cy.contains('Kevin Boateng')
            .should('exist');

        cy.contains('Close')
            .click();
    });

    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Delete view')
        .click();

    cy.contains('Confirm')
        .click();
});
When('you set the date of admission filter', () => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
        });

    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains(/Date of admission|Admission Date/).click());

    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.contains('Absolute range')
                .click();
            cy.get('input[type="text"]')
                .then(($elements) => {
                    cy.wrap($elements[0])
                        .type('2018-01-01').blur();

                    cy.wrap($elements[1])
                        .type('2018-12-31').blur();
                });

            cy.contains('Update')
                .click();
        });
});

When('you set the report date filter', () => {
    const year = getCurrentYear() - 1;
    cy.get('[data-test="event-working-lists"]')
        .contains('Report date')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.contains('Absolute range')
                .click();
            cy.get('input[type="text"]')
                .then(($elements) => {
                    cy.wrap($elements[0])
                        .type(`${year}-01-01`).blur();

                    cy.wrap($elements[1])
                        .type(`${year}-12-31`).blur();
                });

            cy.contains('Update')
                .click();
        });
});

When('you set the Organisation unit filter to Ngelehun', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Organisation unit')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.get('input[placeholder="Search"]')
                .type('Ngelehun');
            cy.contains('Ngelehun', { timeout: 10000 })
                .click();
        });
});

When(/^you save the view as (.*)$/, (name) => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Save current view')
        .click();

    cy.get('[data-test="view-name-content"]')
        .within(() => {
            cy.get('input[type="text"]')
                .type(name)
                .blur();
        });

    cy.intercept('POST', '**/eventFilters**').as('newEventFilter');

    cy.get('button')
        .contains('Save')
        .click();

    cy.wait('@newEventFilter', { timeout: 30000 }).as('newEventResult');
});

When('you set the Pregnant filter to Yes', () => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => cy.contains('More filters').click());
    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Pregnant').click());
    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Yes')
        .click();
    cy.get('[data-test="list-view-filter-apply-button"]').click();
});

When('you set the Age (years) filter to 0-120', () => {
    cy.get('[data-test="event-working-lists"]').contains('Age (years)').click();
    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Min"]')
        .type('0')
        .blur();
    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Max"]')
        .type('120')
        .blur();
    cy.get('[data-test="list-view-filter-apply-button"]').click();
});

When('you set the Height in cm filter to 100-200', () => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => cy.contains('More filters').click());
    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Height in cm').click());
    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Min"]')
        .type('100')
        .blur();
    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Max"]')
        .type('200')
        .blur();
    cy.get('[data-test="list-view-filter-apply-button"]').click();
});

When('you set the Weight in kg filter to 1-200', () => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => cy.contains('More filters').click());
    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Weight in kg').click());
    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Min"]')
        .type('1')
        .blur();
    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Max"]')
        .type('200')
        .blur();
    cy.get('[data-test="list-view-filter-apply-button"]').click();
});

When('you set the Place of Infection filter to Ngelehun', () => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => cy.contains('More filters').click());
    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Place of Infection').click());
    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.get('input[placeholder="Search"]').type('Ngelehun');
            cy.contains('Ngelehun', { timeout: 10000 }).click();
        });
});

When(/^you set the range filter "([^"]+)" to (\d+)-(\d+)$/, (filterName, min, max) => {
    if (filterName === 'Age (years)') {
        cy.get('[data-test="event-working-lists"]').contains('Age (years)').click();
    } else {
        cy.get('[data-test="event-working-lists"]').within(() => cy.contains('More filters').click());
        cy.get('[data-test="more-filters-menu"]').within(() => cy.contains(filterName).click());
    }
    cy.get('[data-test="list-view-filter-contents"]').find('input[placeholder="Min"]').type(min).blur();
    cy.get('[data-test="list-view-filter-contents"]').find('input[placeholder="Max"]').type(max).blur();
    cy.get('[data-test="list-view-filter-apply-button"]').click();
});

When('you set the boolean filter', () => {
    cy.get('[data-test="event-working-lists"]').within(() => cy.contains('More filters').click());
    cy.get('[data-test="more-filters-menu"]').within(() => cy.contains('Pregnant').click());
    cy.get('[data-test="list-view-filter-contents"]').contains('Yes').click();
    cy.get('[data-test="list-view-filter-apply-button"]').click();
});

When('you set the date filter', () => {
    cy.get('[data-test="event-working-lists"]').within(() => cy.contains('More filters').click());
    cy.get('[data-test="more-filters-menu"]').within(() => cy.contains(/Date of admission|Admission Date/).click());
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains('Absolute range').click();
        cy.get('input[type="text"]').then(($inputs) => {
            cy.wrap($inputs[0]).type('2018-01-01').blur();
            cy.wrap($inputs[1]).type('2018-12-31').blur();
        });
        cy.contains('Update').click();
    });
});

When('you set the organisation unit filter', () => {
    cy.get('[data-test="event-working-lists"]').within(() => cy.contains('More filters').click());
    cy.get('[data-test="more-filters-menu"]').within(() => cy.contains('Place of Infection').click());
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.get('input[placeholder="Search"]').type('Ngelehun');
        cy.get('[data-test="dhis2-uicore-circularloader"]').should('not.exist');
        cy.contains('Ngelehun').click();
    });
});

When(/^you set the empty-only filter "([^"]+)" to (Is empty|Is not empty)$/, (filterName, value) => {
    if (filterName === 'Age (years)') {
        cy.get('[data-test="event-working-lists"]').contains('Age (years)').click();
    } else {
        cy.get('[data-test="event-working-lists"]').within(() => cy.contains('More filters').click());
        cy.get('[data-test="more-filters-menu"]').within(() => cy.contains(filterName).click());
    }
    cy.get('[data-test="list-view-filter-contents"]').contains(value).click();
    cy.get('[data-test="list-view-filter-apply-button"]').click();
});

When(/^you set the isEmpty date filter to (Is empty|Is not empty)$/, (value) => {
    cy.get('[data-test="event-working-lists"]').within(() => cy.contains('More filters').click());
    cy.get('[data-test="more-filters-menu"]').within(() => cy.contains(/Date of admission|Admission Date/).click());
    cy.get('[data-test="list-view-filter-contents"]').contains(value).click();
    cy.get('[data-test="list-view-filter-apply-button"]').click();
});

Then('all set filters should show in effect', () => {
    cy.get('[data-test="event-working-lists"]').should('contain', 'Pregnant').and('contain', 'Yes');
    cy.get('[data-test="event-working-lists"]').contains('Age (years): 0 to 120').should('exist');
    cy.get('[data-test="event-working-lists"]').contains('Height in cm: 100 to 200').should('exist');
    cy.get('[data-test="event-working-lists"]').contains('Weight in kg: 1 to 200').should('exist');
    cy.get('[data-test="event-working-lists"]').should(($el) => {
        expect($el.text()).to.include('2018');
        expect($el.text()).to.match(/Admission Date|Date of admission/);
    });
    cy.get('[data-test="event-working-lists"]').should('contain', 'Place of Infection').and('contain', 'Ngelehu');
    cy.get('[data-test="event-working-lists"]').contains('Household location: Is empty').should('exist');
    cy.get('[data-test="event-working-lists"]').contains('Documentation: Is empty').should('exist');
});

Then('the boolean filter should be in effect and show the correct value when opened', () => {
    cy.get('[data-test="event-working-lists"]').should('contain', 'Pregnant').and('contain', 'Yes');
    cy.get('[data-test="event-working-lists"]').contains('Pregnant').click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains('Yes').closest('label').find('input').should('be.checked');
    });
    cy.get('body').click(0, 0);
});

Then(/^the range filter "([^"]+)" should be in effect and show (\d+) to (\d+) when opened$/, (filterName, min, max) => {
    cy.get('[data-test="event-working-lists"]').contains(`${filterName}: ${min} to ${max}`).should('exist');
    cy.get('[data-test="event-working-lists"]').contains(filterName).click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.get('input[placeholder="Min"]').should('have.attr', 'value', min);
        cy.get('input[placeholder="Max"]').should('have.attr', 'value', max);
    });
    cy.get('body').click(0, 0);
});

Then('the date filter should be in effect and show the correct value when opened', () => {
    cy.get('[data-test="event-working-lists"]').should(($el) => {
        expect($el.text()).to.include('2018');
        expect($el.text()).to.match(/Admission Date|Date of admission/);
    });
    cy.get('[data-test="event-working-lists"]').contains(/Admission Date|Date of admission/).click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains('Absolute range').click();
        cy.get('input[type="text"]').then(($inputs) => {
            cy.wrap($inputs[0]).should('have.attr', 'value', '2018-01-01');
            cy.wrap($inputs[1]).should('have.attr', 'value', '2018-12-31');
        });
    });
    cy.get('body').click(0, 0);
});

Then('the organisation unit filter should be in effect and show the correct value when opened', () => {
    cy.get('[data-test="event-working-lists"]').should('contain', 'Place of Infection').and('contain', 'Ngelehu');
    cy.get('[data-test="event-working-lists"]').contains('Place of Infection').click();
    cy.get('[data-test="list-view-filter-contents"]').should('contain', 'Ngelehun');
    cy.get('body').click(0, 0);
});

Then(/^the empty-only filter "([^"]+)" should be in effect and show (Is empty|Is not empty) when opened$/, (filterName, value) => {
    cy.get('[data-test="event-working-lists"]').contains(`${filterName}: ${value}`).should('exist');
    cy.get('[data-test="event-working-lists"]').contains(filterName).click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains(value).closest('label').find('input[type="checkbox"]').should('be.checked');
    });
    cy.get('body').click(0, 0);
});

Then(/^the isEmpty date filter should be in effect and show (Is empty|Is not empty) when opened$/, (value) => {
    cy.get('[data-test="event-working-lists"]').contains(/Admission Date|Date of admission/).should('exist');
    cy.get('[data-test="event-working-lists"]').contains(/Admission Date|Date of admission/).click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains(value).closest('label').find('input[type="checkbox"]').should('be.checked');
    });
    cy.get('body').click(0, 0);
});

Then('the boolean and range filters should show correct values when opened', () => {
    cy.get('[data-test="event-working-lists"]').contains('Pregnant').click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains('Yes').closest('label').find('input').should('be.checked');
    });
    cy.get('body').click(0, 0);

    cy.get('[data-test="event-working-lists"]').contains('Age (years)').click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.get('input[placeholder="Min"]').should('have.attr', 'value', '0');
        cy.get('input[placeholder="Max"]').should('have.attr', 'value', '120');
    });
    cy.get('body').click(0, 0);

    cy.get('[data-test="event-working-lists"]').contains('Height in cm').click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.get('input[placeholder="Min"]').should('have.attr', 'value', '100');
        cy.get('input[placeholder="Max"]').should('have.attr', 'value', '200');
    });
    cy.get('body').click(0, 0);

    cy.get('[data-test="event-working-lists"]').contains('Weight in kg').click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.get('input[placeholder="Min"]').should('have.attr', 'value', '1');
        cy.get('input[placeholder="Max"]').should('have.attr', 'value', '200');
    });
    cy.get('body').click(0, 0);
});

Then('the date and coordinate filters should show correct values when opened', () => {
    cy.get('[data-test="event-working-lists"]').contains(/Admission Date|Date of admission/).click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains('Absolute range').click();
        cy.get('input[type="text"]').then(($inputs) => {
            cy.wrap($inputs[0]).should('have.attr', 'value', '2018-01-01');
            cy.wrap($inputs[1]).should('have.attr', 'value', '2018-12-31');
        });
    });
    cy.get('body').click(0, 0);

    cy.get('[data-test="event-working-lists"]').contains('Household location').click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains('Is empty').closest('label').find('input[type="checkbox"]').should('be.checked');
    });
    cy.get('body').click(0, 0);
});

Then('each filter should show correct value when opened', () => {
    cy.get('[data-test="event-working-lists"]').contains('Pregnant').click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains('Yes').closest('label').find('input').should('be.checked');
    });
    cy.get('body').click(0, 0);

    cy.get('[data-test="event-working-lists"]').contains('Age (years)').click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.get('input[placeholder="Min"]').should('have.attr', 'value', '0');
        cy.get('input[placeholder="Max"]').should('have.attr', 'value', '120');
    });
    cy.get('body').click(0, 0);

    cy.get('[data-test="event-working-lists"]').contains('Height in cm').click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.get('input[placeholder="Min"]').should('have.attr', 'value', '100');
        cy.get('input[placeholder="Max"]').should('have.attr', 'value', '200');
    });
    cy.get('body').click(0, 0);

    cy.get('[data-test="event-working-lists"]').contains('Weight in kg').click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.get('input[placeholder="Min"]').should('have.attr', 'value', '1');
        cy.get('input[placeholder="Max"]').should('have.attr', 'value', '200');
    });
    cy.get('body').click(0, 0);

    cy.get('[data-test="event-working-lists"]').contains(/Admission Date|Date of admission/).click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains('Absolute range').click();
        cy.get('input[type="text"]').then(($inputs) => {
            cy.wrap($inputs[0]).should('have.attr', 'value', '2018-01-01');
            cy.wrap($inputs[1]).should('have.attr', 'value', '2018-12-31');
        });
    });
    cy.get('body').click(0, 0);

    cy.get('[data-test="event-working-lists"]').contains('Household location').click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains('Is empty').closest('label').find('input[type="checkbox"]').should('be.checked');
    });
    cy.get('body').click(0, 0);
});

Then('the Pregnant filter should show Yes in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .should('contain', 'Pregnant')
        .and('contain', 'Yes');
});

Then('the Age (years) filter should show 0 to 120 in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Age (years): 0 to 120')
        .should('exist');
});

Then('the Height in cm filter should show 100 to 200 in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Height in cm: 100 to 200')
        .should('exist');
});

Then('the Weight in kg filter should show 1 to 200 in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Weight in kg: 1 to 200')
        .should('exist');
});

Then('the Admission Date filter should show date range in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .should(($el) => {
            const text = $el.text();
            expect(text).to.include('2018');
            expect(text).to.match(/Admission Date|Date of admission/);
        });
});

Then('the Place of Infection filter should show Ngelehun in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .should('contain', 'Place of Infection')
        .and('contain', 'Ngelehun');
});

Then('the Pregnant filter should show Yes radio checked when opened', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Pregnant')
        .click();
    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.contains('Yes')
                .closest('label')
                .find('input')
                .should('be.checked');
        });
    cy.get('body').click(0, 0);
});

Then('the Age (years) filter should show 0 and 120 in range fields when opened', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Age (years)')
        .click();
    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.get('input[placeholder="Min"]').should('have.attr', 'value', '0');
            cy.get('input[placeholder="Max"]').should('have.attr', 'value', '120');
        });
    cy.get('body').click(0, 0);
});

Then('the Height in cm filter should show 100 and 200 in range fields when opened', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Height in cm')
        .click();
    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.get('input[placeholder="Min"]').should('have.attr', 'value', '100');
            cy.get('input[placeholder="Max"]').should('have.attr', 'value', '200');
        });
    cy.get('body').click(0, 0);
});

Then('the Weight in kg filter should show 1 and 200 in range fields when opened', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Weight in kg')
        .click();
    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.get('input[placeholder="Min"]').should('have.attr', 'value', '1');
            cy.get('input[placeholder="Max"]').should('have.attr', 'value', '200');
        });
    cy.get('body').click(0, 0);
});

Then('the Admission Date filter should show date range when opened', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains(/Admission Date|Date of admission/)
        .click();
    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.contains('Absolute range').click();
            cy.get('input[type="text"]')
                .then(($inputs) => {
                    cy.wrap($inputs[0]).should('have.attr', 'value', '2018-01-01');
                    cy.wrap($inputs[1]).should('have.attr', 'value', '2018-12-31');
                });
        });
    cy.get('body').click(0, 0);
});

Then('the list should display one record with report date matching filter', () => {
    const year = getCurrentYear() - 1;
    cy.get('[data-test="event-working-lists"]')
        .within(() => {
            cy.get('[data-test="working-list-table-loading"]').should('not.exist');
        });
    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 2);
    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .eq(1)
        .find('td')
        .eq(1)
        .invoke('text')
        .then((text) => {
            expect(text).to.include(String(year));
        });
});

Then('the report date filter should be in effect', () => {
    const year = getCurrentYear() - 1;
    cy.get('[data-test="event-working-lists"]')
        .contains('Report date')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.contains('Absolute range')
                .click();
            cy.get('input[type="text"]')
                .then(($elements) => {
                    cy.wrap($elements[0])
                        .should('have.attr', 'value', `${year}-01-01`);

                    cy.wrap($elements[1])
                        .should('have.attr', 'value', `${year}-12-31`);
                });
        });

    cy.get('body').click(0, 0);
});

Then('the Organisation unit filter should be in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Organisation unit')
        .should('exist');
    cy.get('[data-test="event-working-lists"]')
        .contains('Ngelehun')
        .should('exist');
});

Then('the admission filter should be in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Date of admission: 2018-01...')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.contains('Absolute range')
                .click();
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

Then('the saved working list view is cleaned up', () => {
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
