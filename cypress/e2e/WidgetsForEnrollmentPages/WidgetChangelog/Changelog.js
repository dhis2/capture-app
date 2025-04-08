import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';

const getChangelogTableBody = () =>
    cy.get('[data-test="changelog-data-table-body"]');

const getChangelogModal = () =>
    cy.get('[data-test="changelog-modal"]');

const getOverflowButton = () =>
    cy.get('[data-test="widget-event-edit-overflow-button"]');


Given('you select view changelog in the event overflow button', () => {
    getOverflowButton().click();
    cy.get('[data-test="event-overflow-view-changelog"] > a').click();
});

Then('the changelog modal should be visible', () => {
    getChangelogModal().should('be.visible');
});

Then('the changelog modal should contain data', () => {
    getChangelogTableBody()
        .should('be.visible')
        .and('not.contain', 'No changes to display')
        .and('not.have.class', 'loading');
});

Then(/^the number of changelog table rows should be (\d+)$/, (rowCount) => {
    getChangelogTableBody().within(() => {
        cy.get('tr').should('have.length', rowCount);
    });
});

When(/^you change the page size to (.*)$/, (pageSize) => {
    getChangelogTableBody().should('not.contain', 'No changes to display');

    cy.get('[data-test="changelog-pagination-pagesize-select"]').click();

    cy.get('[data-test="dhis2-uicore-select-menu-menuwrapper"]')
        .contains(pageSize)
        .click();
});

When('you move to the next page', () => {
    cy.get('[data-test="changelog-pagination-page-next"]').click();
});

When('you move to the previous page', () => {
    cy.get('[data-test="changelog-pagination-page-previous"]').click();
});

Then(/^the table footer should display page (\d+)$/, (pageNumber) => {
    cy.get('[data-test="changelog-pagination-summary"]')
        .contains(`Page ${pageNumber}`);
});

When('you select {string} from the data item filter flyout menu', (dataItem) => {
    cy.get('[data-test="changelog-filter-dataItem"]').click();
    cy.get('[data-test="changelog-filter-dataItem-flyoutmenu"]')
        .contains(dataItem)
        .click();
});

Then('only rows with Data item {string} should be displayed', (dataItem) => {
    cy.get('[data-test="changelog-data-table-body"] tr')
        .first()
        .should('contain.text', dataItem);

    cy.get('[data-test="changelog-data-table-body"] tr').each(($row) => {
        cy.wrap($row)
            .find('td')
            .eq(2)
            .should('contain.text', dataItem);
    });
});

Then('the filter pill should be visible with label {string}', (filterLabel) => {
    cy.get('[data-test="changelog-filter-dataItem"]')
        .should('contain.text', filterLabel)
        .and('be.visible');
});

When('you remove the filter', () => {
    cy.get('[data-test="changelog-filter-dataItem"]').click();
    cy.get('[data-test="changelog-filter-dataItem-flyoutmenu"]')
        .contains('Show all')
        .click();
});

When('you click the sort Date icon', () => {
    cy.get('[data-test="changelog-sort-date"]')
        .find('svg')
        .click();
    cy.intercept('GET', '**/changeLogs?*order=createdAt:*');
});

Then('the changelog data is sorted on Date in ascending order', () => {
    const parseDate = text => new Date(text).getTime();
    let previous = 0;

    cy.get('[data-test="changelog-data-table-body"] tr').each(($row) => {
        cy.wrap($row)
            .find('td')
            .eq(0)
            .invoke('text')
            .then((text) => {
                const current = parseDate(text.trim());
                expect(current).to.be.at.least(previous);
                previous = current;
            });
    });
});

When('you click the sort User icon', () => {
    cy.get('[data-test="changelog-sort-date"]')
        .find('svg')
        .click();
    cy.intercept('GET', '**/changeLogs?*order=createdAt:*');
});

Then('the changelog data is sorted on User in ascending order', () => {
    const parseDate = text => new Date(text).getTime();
    let previous = 0;

    cy.get('[data-test="changelog-data-table-body"] tr').each(($row) => {
        cy.wrap($row)
            .find('td')
            .eq(0)
            .invoke('text')
            .then((text) => {
                const current = parseDate(text.trim());
                expect(current).to.be.at.least(previous);
                previous = current;
            });
    });
});

When('you click the sort Data item icon', () => {
    cy.get('[data-test="changelog-sort-date"]')
        .find('svg')
        .click();
    cy.intercept('GET', '**/changeLogs?*order=createdAt:*');
});

Then('the changelog data is sorted on Data item in ascending order', () => {
    const parseDate = text => new Date(text).getTime();
    let previous = 0;

    cy.get('[data-test="changelog-data-table-body"] tr').each(($row) => {
        cy.wrap($row)
            .find('td')
            .eq(0)
            .invoke('text')
            .then((text) => {
                const current = parseDate(text.trim());
                expect(current).to.be.at.least(previous);
                previous = current;
            });
    });
});
