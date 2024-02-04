import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import '../../sharedSteps';

beforeEach(() => {
    // Disable cache for chromium browsers to force the api to be called
    if (Cypress.browser.family === 'chromium') {
        Cypress.automation('remote:debugger:protocol', {
            command: 'Network.enable',
            params: {},
        });
        Cypress.automation('remote:debugger:protocol', {
            command: 'Network.setCacheDisabled',
            params: { cacheDisabled: true },
        });
    }
});

Given('you open the main page with Ngelehun and child programme context', () => {
    cy.intercept('GET', '**/tracker/trackedEntities**').as('getDefaultTeis');

    cy.visit('#/?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8');
});

Given('you open the main page with Ngelehun and Malaria focus investigation context', () => {
    cy.intercept('GET', '**/tracker/trackedEntities**').as('getDefaultTeis');

    cy.visit('#/?programId=M3xtLkYBlKI&orgUnitId=DiszpKrYNg8');
});

Then('teis should be retrieved from the api using the default query args', () => {
    cy.wait('@getDefaultTeis', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('response.statusCode')
        .should('eq', 200);

    cy.get('@result')
        .its('response.url')
        .should('include', 'pageSize=15');

    cy.get('@result')
        .its('response.url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body').as('teis');
});

Then('the first page of the default tei working list should be displayed', () => {
    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('exist');

    cy.contains('Page 1')
        .should('exist');
});

When('you select the working list called Active enrollments', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Active enrollments')
        .should('exist');

    cy.intercept('GET', '**/tracker/trackedEntities**').as('getTeisWithEnrollmentStatusActive');

    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Active enrollments')
        .click();
});


When('you apply the enrollment status filter', () => {
    cy.intercept('GET', '**/tracker/trackedEntities**').as('getTeisWithEnrollmentStatusActive');

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Then('teis with an active enrollment should be retrieved from the api', () => {
    cy.wait('@getTeisWithEnrollmentStatusActive', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('response.statusCode')
        .should('eq', 200);

    cy.get('@result')
        .its('response.url')
        .should('include', 'programStatus=ACTIVE');

    cy.get('@result')
        .its('response.url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body').as('teis');
});

When('you apply the assignee filter', () => {
    cy.intercept('GET', '**/tracker/trackedEntities**').as('getTeisStatusAndAssigneeFilter');

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Then('teis with active enrollments and unassigned events should be retrieved from the api', () => {
    cy.wait('@getTeisStatusAndAssigneeFilter', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('response.statusCode')
        .should('eq', 200);

    cy.get('@result')
        .its('response.url')
        .should('include', 'programStatus=ACTIVE');

    cy.get('@result')
        .its('response.url')
        .should('include', 'assignedUserMode=NONE');

    cy.get('@result')
        .its('response.url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body').as('teis');
});

When('you apply the current filter on the tei working list', () => {
    cy.intercept('GET', '**/tracker/trackedEntities**').as('getTeis');

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Then('teis with a first name containing John should be retrieved from the api', () => {
    cy.wait('@getTeis', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('response.statusCode')
        .should('eq', 200);

    cy.get('@result')
        .its('response.url')
        .should('match', /filter=.*John/);

    cy.get('@result')
        .its('response.url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body').as('teis');
});

Then('the list should display the teis retrieved from the api', () => {
    cy.get('@teis')
        .then((body) => {
            const apiTrackedEntities = body.trackedEntities || body.instances || [];
            cy.get('[data-test="tei-working-lists"]')
                .find('tr')
                .should('have.length', apiTrackedEntities.length + 1);
        });

    cy.get('@teis')
        .then((body) => {
            const apiTrackedEntities = body.trackedEntities || body.instances || [];
            cy.get('[data-test="tei-working-lists"]')
                .find('tr')
                .each(($teiRow, index) => {
                    const rowId = $teiRow.get(0).getAttribute('data-test');
                    if (index > 1) {
                        expect(rowId).to.equal(apiTrackedEntities[index - 1].trackedEntity);
                    }
                });
        });
});

When('you click the next page button on the tei working list', () => {
    cy.get('[data-test="search-pagination-next-page"]')
        .should('exist');

    cy.intercept('GET', '**/tracker/trackedEntities**').as('getTeis');

    cy.get('[data-test="search-pagination-next-page"]')
        .click();
});

Then('new teis should be retrieved from the api', () => {
    cy.wait('@getTeis', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('response.statusCode')
        .should('eq', 200);

    cy.get('@result').its('response.body').as('teis');
});


When('you click the previous page button on the tei working list', () => {
    cy.intercept('GET', '**/tracker/trackedEntities**').as('getTeis');

    cy.get('[data-test="search-pagination-previous-page"]')
        .click();
});

When('you change rows per page to 50', () => {
    cy.get('div[data-test="rows-per-page-selector"]')
        .should('exist');

    cy.intercept('GET', '**/tracker/trackedEntities**').as('getTeis');

    cy.get('div[data-test="rows-per-page-selector"]')
        .click()
        .contains('50')
        .click();
});

Then('a tei batch capped at 50 records should be retrieved from the api', () => {
    cy.wait('@getTeis', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('response.statusCode')
        .should('eq', 200);

    cy.get('@result')
        .its('response.url')
        .should('include', 'pageSize=50');

    cy.get('@result')
        .its('response.url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body').as('teis');
});

When('you click the first page button on the tei working list', () => {
    cy.intercept('GET', '**/tracker/trackedEntities**').as('getTeis');

    cy.get('[data-test="search-pagination-first-page"]')
        .click();
});

When('you click the first name column header', () => {
    cy.get('[data-test="online-list-table"]')
        .contains('First name')
        .should('exist');

    cy.intercept('GET', '**/tracker/trackedEntities**').as('getTeis');

    cy.get('[data-test="dhis2-uicore-tableheadercellaction"]')
        .eq(0)
        .click();
});

Then('teis should be retrieved from the api ordered ascendingly by first name', () => {
    cy.wait('@getTeis', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('response.statusCode')
        .should('eq', 200);

    cy.get('@result')
        .its('response.url')
        .should('match', /order=.*asc/);

    cy.get('@result')
        .its('response.url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body').as('teis');
});
