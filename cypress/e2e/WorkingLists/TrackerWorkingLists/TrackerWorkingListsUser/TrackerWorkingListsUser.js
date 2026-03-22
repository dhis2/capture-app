import { defineStep as And, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { v4 as uuid } from 'uuid';
import '../sharedSteps';
import { hasVersionSupport } from '../../../../support/tagUtils';
import { truncateFilterLabelForTest } from '../../../../support/filterLabelTestUtils';

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

const cleanUpTeiFilterIfApplicable = (programId, filterName) => {
    cy.buildApiUrl(`trackedEntityInstanceFilters?filter=program.id:eq:${programId}&fields=id,displayName`)
        .then(url => cy.request(url))
        .then(({ body }) => {
            const filter = body.trackedEntityInstanceFilters &&
                body.trackedEntityInstanceFilters.find(e => e.displayName === filterName);
            if (!filter) {
                return null;
            }
            return cy
                .buildApiUrl('trackedEntityInstanceFilters', filter.id)
                .then(filterUrl => cy.request('DELETE', filterUrl));
        });
};
Given('you open the main page with Ngelehun and child programe context', () => {
    cy.visit('#/?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8');
});

Given('you open the main page with Ngelehun and child programme default template context', () => {
    cy.visit('#/?orgUnitId=DiszpKrYNg8&programId=IpHINAT79UW&selectedTemplateId=IpHINAT79UW-default');
});

Given('you open the main page with child programe context', () => {
    cy.visit('#/?programId=IpHINAT79UW');
});

Given('you open the main page with Ngelehun and TEI value types program context', () => {
    cy.visit('#/?orgUnitId=DiszpKrYNg8&programId=ur1Edk5Oe2n&selectedTemplateId=ur1Edk5Oe2n-default');
});

Given('you open the main page with Ngelehun and WHO RMNCH Tracker context', () => {
    cy.visit('#/?programId=WSGAb5XwJ3Y&orgUnitId=DiszpKrYNg8&selectedTemplateId=WSGAb5XwJ3Y-default');
});

Given('you open the main page with Ngelehun and Malaria focus investigation context', () => {
    cy.visit('#/?programId=M3xtLkYBlKI&orgUnitId=DiszpKrYNg8');
});

Given('you open the main page with Ngelehun, WHO RMNCH Tracker and First antenatal care visit context', () => {
    cy.visit('#/?programId=WSGAb5XwJ3Y&orgUnitId=DiszpKrYNg8&selectedTemplateId=WSGAb5XwJ3Y-default');

    cy.get('[data-test="tracker-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
        });

    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Program stage').click());

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('First antenatal care visit')
        .click();

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Given('you open the main page with Ngelehun, WHO RMNCH Tracker and Care at birth context', () => {
    cy.visit('#/?orgUnitId=DiszpKrYNg8&programId=WSGAb5XwJ3Y&selectedTemplateId=WSGAb5XwJ3Y-default');

    cy.get('[data-test="tracker-working-lists"]')
        .within(() => cy.contains('More filters').click());

    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Program stage').click());

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Care at birth')
        .click();

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Given('you open the main page with Ngelehun and Malaria case diagnosis context', () => {
    cleanUpTeiFilterIfApplicable('qDkgAbB5Jlk', 'My custom list');
    cy.visit('#/?programId=qDkgAbB5Jlk&orgUnitId=DiszpKrYNg8');
});

Given('you open the main page with Ngelehun and Malaria case diagnosis default template context', () => {
    cy.visit('#/?orgUnitId=DiszpKrYNg8&programId=qDkgAbB5Jlk&selectedTemplateId=qDkgAbB5Jlk-default');
});

Given('you open the main page with Ngelehun and Malaria case diagnosis and Household investigation context', () => {
    cleanUpIfApplicable('qDkgAbB5Jlk');
    cy.visit('#/?programId=qDkgAbB5Jlk&orgUnitId=DiszpKrYNg8');

    cy.get('[data-test="tracker-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
        });

    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Program stage').click());

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

    cy.get('[data-test="tracker-working-lists"]')
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

    cy.get('[data-test="tracker-working-lists"]')
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
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Enrollment status: Completed')
        .should('exist');
});

When('you set the enrollment status filter to completed', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Enrollment status')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Completed')
        .click();
});

When('you set the enrollment date to a relative range', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Enrollment date')
        .click();
    cy.contains('Relative range')
        .click();
    cy.get('[data-test="date-range-filter-start"]')
        .type('1000');
    cy.get('[data-test="date-range-filter-end"]')
        .type('1000');
});

When('you set the event status filter to completed', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Event status')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Completed')
        .click();
});

When('you set the WHOMCH Smoking filter to No', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .within(() => {
            cy.get('[data-test="more-filters"]').eq(1)
                .click();
        });

    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('WHOMCH Smoking').click());

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('No')
        .click();
});

Then('the list should display teis with an active enrollment and unassinged events', () => {
    const ids = [
        'ZDA984904',
        'FSL05494',
    ];

    cy.get('[data-test="tracker-working-lists"]')
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
    cy.get('[data-test="tracker-working-lists"]')
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
    cy.get('[data-test="select-columns-reference"]').find('button')
        .click();
});

When('you select the organisation unit and save from the column selector', () => {
    cy.get('aside[role="dialog"]')
        .contains('Owner organisation unit')
        .parents('tr')
        .find('input[type="checkbox"]')
        .click();

    cy.get('aside[role="dialog"]')
        .contains('Save')
        .click();
});

Then('the organisation unit should display in the list', () => {
    cy.get('[data-test="online-list-table"]')
        .contains('Owner organisation unit')
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

    cy.get('[data-test="tracker-working-lists"]')
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

    cy.get('[data-test="tracker-working-lists"]')
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

    cy.get('[data-test="tracker-working-lists"]')
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

    cy.get('[data-test="tracker-working-lists"]')
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

    cy.get('[data-test="tracker-working-lists"]')
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
        .within(() => {
            cy.get('input[type="text"]')
                .type('My custom list')
                .blur();
        });

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
        .within(() => {
            cy.get('input[type="text"]')
                .type('Custom Program stage list')
                .blur();
        });

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

When(/^you set the date filter "([^"]+)" to (.+) and (.+)$/, (filterName, startDate, endDate) => {
    if (CARE_AT_BIRTH_STAGE_FILTER_NAMES.has(filterName)) {
        cy.get('[data-test="tracker-working-lists"]').within(() => cy.get('[data-test="more-filters"]').eq(1).click());
    } else {
        cy.get('[data-test="tracker-working-lists"]').within(() => cy.contains('More filters').click());
    }
    cy.get('[data-test="more-filters-menu"]').within(() => cy.contains(filterName).click());
    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.contains('Absolute range')
                .click();
            cy.get('input[type="text"]')
                .then(($elements) => {
                    cy.wrap($elements[0])
                        .type(startDate).blur();

                    cy.wrap($elements[1])
                        .type(endDate).blur();
                });

            cy.contains('Update')
                .click();
        });
});

When(/^you set the range filter "([^"]+)" to (-?\d+)-(-?\d+)$/, (filterName, min, max) => {
    if (CARE_AT_BIRTH_STAGE_FILTER_NAMES.has(filterName)) {
        cy.get('[data-test="tracker-working-lists"]').within(() => cy.get('[data-test="more-filters"]').eq(1).click());
    } else {
        cy.get('[data-test="tracker-working-lists"]').within(() => cy.contains('More filters').click());
    }
    cy.get('[data-test="more-filters-menu"]').within(() => cy.contains(filterName).click());
    cy.get('[data-test="list-view-filter-contents"]').find('input[placeholder="Min"]').type(min).blur();
    cy.get('[data-test="list-view-filter-contents"]').find('input[placeholder="Max"]').type(max).blur();
    cy.get('[data-test="list-view-filter-apply-button"]').click();
});

When(/^you set the text filter "([^"]+)" to (.*)$/, (filterName, value) => {
    openStageFilterMenu(filterName);
    cy.get('[data-test="more-filters-menu"]').within(() => cy.contains(filterName).click());
    cy.get('[data-test="list-view-filter-contents"]').find('input[type="text"]').type(value);
    cy.get('[data-test="list-view-filter-apply-button"]').click();
});

const BIRTH_STAGE_FILTER_NAMES = new Set(['Birth certificate', 'BCG dose', 'Apgar comment']);

// Care at birth program stage data elements: INTEGER_POSITIVE, INTEGER_ZERO_OR_POSITIVE, INTEGER_NEGATIVE, PERCENTAGE, ORGANISATION_UNIT, DATE
const CARE_AT_BIRTH_STAGE_FILTER_NAMES = new Set([
    'WHOMCH Fetal heart rate on admission',
    'WHOMCH Estimated blood loss (ml)',
    'WHOMCH Hospital / Birth clinic',
    'WHOMCH Body temperature',
    'WHOMCH Haematocrit value',
    'WHOMCH Heart rate',
    'WHOMCH Respiratory rate',
    'WHOMCH Date of induction of labor',
]);

function openStageFilterMenu(filterName) {
    const isBirthStageFilter = BIRTH_STAGE_FILTER_NAMES.has(filterName);
    if (isBirthStageFilter) {
        let needProgramStageFlow = false;
        cy.get('[data-test="tracker-working-lists"]').within(() => {
            cy.get('[data-test="more-filters"]').then(($buttons) => {
                if ($buttons.length >= 2) {
                    cy.wrap($buttons.eq(1)).click();
                } else {
                    needProgramStageFlow = true;
                    cy.contains('More filters').click();
                }
            });
        });
        cy.then(() => {
            if (needProgramStageFlow) {
                cy.get('[data-test="more-filters-menu"]').within(() => cy.contains('Program stage').click());
                cy.get('[data-test="list-view-filter-contents"]').contains('Birth').click();
                cy.get('[data-test="list-view-filter-apply-button"]').click();
                cy.get('[data-test="tracker-working-lists"]').within(() => cy.get('[data-test="more-filters"]').eq(1).click());
            }
        });
    } else {
        cy.get('[data-test="tracker-working-lists"]').within(() => cy.contains('More filters').click());
    }
}

When('you open the program stage More filters menu for Birth on the tracker working list', () => {
    cy.get('[data-test="tracker-working-lists"]').within(() => cy.contains('More filters').click());
    cy.get('[data-test="more-filters-menu"]').within(() => cy.contains('Program stage').click());
    cy.get('[data-test="list-view-filter-contents"]').contains('Birth').click();
    cy.get('[data-test="list-view-filter-apply-button"]').click();
    cy.get('[data-test="tracker-working-lists"]').within(() => cy.get('[data-test="more-filters"]').eq(1).click());
});

When(/^you set the empty-only filter "([^"]+)" to (Is empty|Is not empty)$/, (filterName, value) => {
    openStageFilterMenu(filterName);
    cy.get('[data-test="more-filters-menu"]').within(() => cy.contains(filterName).click());
    cy.get('[data-test="list-view-filter-contents"]').contains(value).click();
    cy.get('[data-test="list-view-filter-apply-button"]').click();
});

When(/^you set the option filter "([^"]+)" to (Yes|No)$/, (filterName, value) => {
    openStageFilterMenu(filterName);
    cy.get('[data-test="more-filters-menu"]').within(() => cy.contains(filterName).click());
    cy.get('[data-test="list-view-filter-contents"]').contains(value).click();
    cy.get('[data-test="list-view-filter-apply-button"]').click();
});

When(/^you set the program stage organisation unit filter "([^"]+)" to "([^"]+)"$/, (filterName, searchTerm) => {
    cy.get('[data-test="tracker-working-lists"]').within(() => cy.get('[data-test="more-filters"]').eq(1).click());
    cy.get('[data-test="more-filters-menu"]').within(() => cy.contains(filterName).click());
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.get('input[placeholder="Search"]').type(searchTerm);
        cy.get('[data-test="dhis2-uicore-circularloader"]').should('not.exist');
        cy.contains(searchTerm).click();
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

    cy.intercept('POST', '**/trackedEntityInstanceFilters**').as('newTrackerFilterResult');

    cy.get('button')
        .contains('Save')
        .click();

    cy.wait('@newTrackerFilterResult', { timeout: 30000 });
});

When(/^you save the program stage view as (.*)$/, (name) => {
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

    cy.intercept('POST', '**/programStageWorkingLists**').as('newTrackerFilterResult');

    cy.get('button')
        .contains('Save')
        .click();

    cy.wait('@newTrackerFilterResult', { timeout: 30000 });
});

// Program stage: chip click can navigate to default; open saved view by URL with template id from save response
When(/^you open the saved program stage view (.+)$/, (viewName) => {
    cy.get('@newTrackerFilterResult').then((result) => {
        expect(result.response.statusCode).to.equal(201);
        const body = result.response?.body;
        const templateId = body?.response?.uid ?? body?.uid;
        expect(templateId, 'saved program stage working list id').to.be.a('string').and.not.to.be.empty;

        cy.location('hash').then((hash) => {
            const queryStart = hash.indexOf('?');
            const queryString = queryStart >= 0 ? hash.substring(queryStart + 1) : hash.slice(1) || '';
            const params = new URLSearchParams(queryString);
            expect(params.get('programId'), 'programId in URL').to.be.a('string').and.not.to.be.empty;
            params.set('selectedTemplateId', templateId);
            cy.visit(`#/?${params.toString()}`);
        });
    });
});

// Chip label may truncate the full label (name + value); assert the specific chip text, then verify full value in input when opened
Then(/^the text filter "([^"]+)" should be in effect and show (.*) when opened$/, (filterName, value) => {
    const chipLabel = truncateFilterLabelForTest(`${filterName}: ${value}`);
    cy.get('[data-test="tracker-working-lists"]').contains(chipLabel).should('be.visible');
    cy.get('[data-test="tracker-working-lists"]').contains(chipLabel).click();
    cy.get('[data-test="list-view-filter-contents"]').find('input[type="text"]').invoke('attr', 'value').should('equal', value);
    cy.get('body').click(0, 0);
});

Then(/^the date filter "([^"]+)" should be in effect and show (.+) to (.+) when opened$/, (filterName, startDate, endDate) => {
    const chipLabel = truncateFilterLabelForTest(`${filterName}: ${startDate} to ${endDate}`);
    cy.get('[data-test="tracker-working-lists"]').contains(chipLabel).should('exist');
    cy.get('[data-test="tracker-working-lists"]').contains(chipLabel).click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains('Absolute range').click();
        cy.get('[data-test="date-filter-from"]').find('input').should('have.attr', 'value', startDate);
        cy.get('[data-test="date-filter-to"]').find('input').should('have.attr', 'value', endDate);
    });
    cy.get('body').click(0, 0);
});

Then(/^the range filter "([^"]+)" should be in effect and show (-?\d+) to (-?\d+) when opened$/, (filterName, min, max) => {
    const chipLabel = truncateFilterLabelForTest(`${filterName}: ${min} to ${max}`);
    cy.get('[data-test="tracker-working-lists"]').contains(chipLabel).should('exist');
    cy.get('[data-test="tracker-working-lists"]').contains(chipLabel).click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.get('input[placeholder="Min"]').should('have.attr', 'value', min);
        cy.get('input[placeholder="Max"]').should('have.attr', 'value', max);
    });
    cy.get('body').click(0, 0);
});

Then(/^the empty-only filter "([^"]+)" should be in effect and show (Is empty|Is not empty) when opened$/, (filterName, value) => {
    const chipLabel = truncateFilterLabelForTest(`${filterName}: ${value}`);
    cy.get('[data-test="tracker-working-lists"]').contains(chipLabel).should('exist');
    cy.get('[data-test="tracker-working-lists"]').contains(chipLabel).click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains(value).closest('label').find('input[type="checkbox"]').should('be.checked');
    });
    cy.get('body').click(0, 0);
});

Then(/^the option filter "([^"]+)" should be in effect and show (Yes|No) when opened$/, (filterName, value) => {
    const chipLabel = truncateFilterLabelForTest(`${filterName}: ${value}`);
    cy.get('[data-test="tracker-working-lists"]').contains(chipLabel).should('exist');
    cy.get('[data-test="tracker-working-lists"]').contains(chipLabel).click();
    cy.get('[data-test="list-view-filter-contents"]').within(() => {
        cy.contains(value).closest('label').find('input').should('be.checked');
    });
    cy.get('body').click(0, 0);
});

// Chip label may truncate the full label; assert chip shows expected truncated text, then verify full value when opened
Then(/^the program stage organisation unit filter "([^"]+)" should be in effect and show "([^"]+)" when opened$/, (filterName, expectedOrgUnitName) => {
    const chipLabel = truncateFilterLabelForTest(`${filterName}: ${expectedOrgUnitName}`);
    cy.get('[data-test="tracker-working-lists"]').contains(chipLabel).should('be.visible');
    cy.get('[data-test="tracker-working-lists"]').contains(chipLabel).click();
    cy.get('[data-test="list-view-filter-contents"]').should('contain', expectedOrgUnitName);
    cy.get('body').click(0, 0);
});

Then('the saved tracker working list view is cleaned up', () => {
    cy.get('@newTrackerFilterResult').then((result) => {
        expect(result.response.statusCode).to.equal(201);
        const body = result.response?.body;
        const id = body?.response?.uid ?? body?.uid;
        const resource = result.request?.url?.includes('programStageWorkingLists')
            ? 'programStageWorkingLists'
            : 'trackedEntityInstanceFilters';
        cy.buildApiUrl(resource, id).then((url) => {
            cy.request('DELETE', url);
        });
    });
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

When('you create a copy of the working list',
    () => {
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
    cy.get('[data-test="tracker-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
        });
    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Program stage').click());
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
        .parents('tr')
        .find('input[type="checkbox"]')
        .click();

    cy.get('aside[role="dialog"]')
        .contains('Save')
        .click();
});

Then('you see data elements specific filters and columns', () => {
    cy.get('[data-test="filter-button-container-assignee"]')
        .should('exist');
    cy.get('[data-test="tracker-working-lists"]')
        .should('exist');
});

Then('the list should display 1 row of data', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Enrollment status: Active')
        .should('exist');
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Event status: Completed')
        .should('exist');
    cy.get('[data-test="tracker-working-lists"]')
        .contains('First name: Urzula')
        .should('exist');
    cy.get('[data-test="tracker-working-lists"]')
        .contains('WHOMCH Smoking: No')
        .should('exist');

    cy.get('[data-test="tracker-working-lists"]')
        .find('tr')
        .should('have.length', 2);
    cy.get('[data-test="tracker-working-lists"]')
        .find('table')
        .contains('Urzula')
        .should('exist');
});

Then(/^you ?(.*) see program stage working list events/, (not) => {
    cy.get('[data-test="tracker-working-lists"]')
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

When('you open a tei from the working list', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Filona')
        .click();
});

When('you deselect the tracked entity from the context selector', () => {
    cy.get('[data-test="person-selector-container-clear-icon"]')
        .click();
});

// the working list called completed enrollments should be selected
Then('the working list called completed enrollments should be selected', () => {
    cy.get('[data-test="workinglist-template-selector-chip"]')
        .contains('Completed enrollments')
        .parent()
        .should('have.class', 'selected');
});

Then('you see scheduledAt filter', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Appointment date')
        .should('exist');
});

When('you select a scheduledAt column and save from the column selector', () => {
    cy.get('aside[role="dialog"]')
        .contains('Appointment date')
        .parents('tr')
        .find('input[type="checkbox"]')
        .click();

    cy.get('aside[role="dialog"]')
        .contains('Save')
        .click();
});

When('you select the events scheduled today', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Appointment date')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Today')
        .click();
});

Then('you see the selected option in the scheduledAt filter', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Appointment date: Today')
        .should('exist');
});

Then('you are redirect to the default templete', () => {
    cy.url().should('include', '-default');
});

Then('the TEI working list initial configuration was kept', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Enrollment status: Active')
        .should('exist');
    cy.get('[data-test="tracker-working-lists"]')
        .find('[data-test="more-filters"]')
        .should('have.length', 2);
});

And('you change the org unit', () => {
    cy.get('[data-test="org-unit-selector-container"]')
        .click();
    cy.get('input[type="text"]')
        .type('Njandama MCHP');
    cy.contains('Njandama MCHP')
        .click();
});

Then('the working list configuration was kept', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Event status: Completed')
        .should('exist');
});

Then('the program stage custom working list filters are loaded', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .find('[data-test="more-filters"]')
        .should('have.length', 2);
});

Given('you open the main page with Ngelehun and WHO RMNCH Tracker context and configure a program stage working list', () => {
    cy.visit('#/?programId=WSGAb5XwJ3Y&orgUnitId=DiszpKrYNg8&selectedTemplateId=WSGAb5XwJ3Y-default');

    cy.get('[data-test="tracker-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
        });

    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Program stage').click());

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Postpartum care visit')
        .click();

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Given('you open the main page with all accesible records in the WHO RMNCH Tracker context and configure a program stage working list', () => {
    cy.visit('#/?programId=WSGAb5XwJ3Y&all');

    cy.get('[data-test="tracker-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
        });

    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Program stage').click());

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
    cy.get('[data-test="tracker-working-lists"]')
        .find('[data-test="more-filters"]')
        .should('have.length', 2);

    cy.get('[data-test="tracker-working-lists"]')
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
    const pagingParam = hasVersionSupport('@v>=41') ? 'paging=false' : 'skipPaging=true';
    const orgUnitModeParam = hasVersionSupport('@v>=41') ? 'orgUnitMode' : 'ouMode';
    const orgUnitParam = hasVersionSupport('@v>=41') ? 'orgUnits' : 'orgUnit';
    const params = `order=createdAt%3Adesc&${orgUnitParam}=DiszpKrYNg8&${orgUnitModeParam}=SELECTED&program=IpHINAT79UW&fields=%3Aall%2C%21relationships%2CprogramOwners%5BorgUnit%2Cprogram%5D&${pagingParam}`;
    cy.get('[data-test="working-lists-download-dialog"]')
        .within(() => {
            cy.contains('Download as CSV');

            cy.get('a')
                .eq(1)
                .should('have.attr', 'href').and('include', `/trackedEntities.csv?${params}`);
        });
});

Then('the JSON button exists', () => {
    const pagingParam = hasVersionSupport('@v>=41') ? 'paging=false' : 'skipPaging=true';
    const orgUnitModeParam = hasVersionSupport('@v>=41') ? 'orgUnitMode' : 'ouMode';
    const orgUnitParam = hasVersionSupport('@v>=41') ? 'orgUnits' : 'orgUnit';
    const params = `order=createdAt%3Adesc&${orgUnitParam}=DiszpKrYNg8&${orgUnitModeParam}=SELECTED&program=IpHINAT79UW&fields=%3Aall%2C%21relationships%2CprogramOwners%5BorgUnit%2Cprogram%5D&${pagingParam}`;
    cy.get('[data-test="working-lists-download-dialog"]')
        .within(() => {
            cy.contains('Download as JSON');

            cy.get('a')
                .eq(0)
                .should('have.attr', 'href').and('include', `/trackedEntities.json?${params}`);
        });
});

When('you set the event visit date to Today', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Date of visit')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Today')
        .click();
});

Then('the working list is empty', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('No items to display')
        .click();
});

Then('the assignee column is displayed', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Assigned to')
        .should('exist');

    cy.get('[data-test="dhis2-uicore-tablebody"]')
        .contains('Tracker demo User (tracker)')
        .should('exist');

    cy.get('[data-test="tracker-working-lists"]')
        .find('tr')
        .should('have.length', 2);
});

And('you filter by assigned Foci investigation & classification events', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
        });

    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Program stage').click());

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Foci investigation & classification')
        .click();

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();

    cy.get('[data-test="tracker-working-lists"]')
        .contains('Assigned to')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Anyone')
        .click();

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});
