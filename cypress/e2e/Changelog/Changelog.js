import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

const getChangelogTableBody = () =>
    cy.get('[data-test="changelog-data-table-body"]');

Given(/^you land on the enrollment edit event page by having typed (.*)$/, (url) => {
    cy.visit(url);
});

Given(/^you land on the view event page by having typed (.*)$/, (url) => {
    cy.visit(url);
});

Given('you select view changelog in the event overflow button', () => {
    cy.get('[data-test="tracker-program-event-overflow-button"]').click();
    cy.get('[data-test="tracker-program-event-changelog"] > a').click();
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
    cy.get('[data-test="changelog-sort-user"]')
        .find('svg')
        .click();
});

Then('the changelog data is sorted on User in ascending order', () => {
    cy.get('[data-test="changelog-data-table-body"] tr td:nth-child(2)').then(($cells) => {
        const values = [...$cells].map(cell => cell.textContent.trim().toLowerCase());

        const collator = new Intl.Collator(undefined, {
            sensitivity: 'base',
            numeric: true,
        });

        const sorted = [...values].sort((a, b) => collator.compare(a, b));
        expect(values).to.deep.equal(sorted);
    });
});

When('you click the sort Data item icon', () => {
    cy.get('[data-test="changelog-sort-dataItem"]')
        .find('svg')
        .click();
});

Then('the changelog data is sorted on Data item in ascending order', () => {
    cy.get('[data-test="changelog-data-table-body"] tr td:nth-child(3)').then(($cells) => {
        const values = [...$cells].map(cell => cell.textContent.trim().toLowerCase());

        const collator = new Intl.Collator(undefined, {
            sensitivity: 'base',
            numeric: true,
        });

        const sorted = [...values].sort((a, b) => collator.compare(a, b));
        expect(values).to.deep.equal(sorted);
    });
});

When('you open the tracked entity changelog', () => {
    cy.get('[data-test="tracked-entity-profile-overflow-button"]').should('be.visible').click();
        cy.get('[data-test="tracked-entity-profile-overflow-menu"]').should('be.visible');
        cy.get('[data-test="tracked-entity-profile-overflow-menu"]').within(() => {
        cy.contains('View changelog').click();
    });
});

When('you open the event program changelog', () => {
    cy.get('[data-test="event-program-event-overflow-button"]').should('be.visible').click();
    cy.get('[data-test="event-program-event-overflow-menu"]').should('be.visible');
    cy.get('[data-test="event-program-event-overflow-menu"]').within(() => {
    cy.contains('View changelog').click();
    });
});

Then('the changelog modal should be visible', () => {
    getChangelogTableBody()
        .should('be.visible')
        .and('not.contain', 'No changes to display')
        .and('not.have.class', 'loading');
    cy.get('[data-test="changelog-data-table-body"] tr').should('have.length.gt', 0);
});
