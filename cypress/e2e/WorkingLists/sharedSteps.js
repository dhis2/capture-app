import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { truncateFilterLabelForTest } from '../../support/filterLabelTestUtils';

Then('for an event program the page navigation should show that you are on the first page', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Page 1')
        .should('exist');
});

Then('for a tracker program the page navigation should show that you are on the first page', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Page 1')
        .should('exist');
});

When('you set the status filter to active', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Status')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Active')
        .click();
});

Then('the status filter button should show that the active filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Status: Active')
        .should('exist');
});

When(/^you set the age filter to (\d+)-(\d+)$/, (min, max) => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();
        });

    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Age (years)').click());

    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Min"]')
        .type(min)
        .blur();

    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Max"]')
        .type(max)
        .blur();
});

Then(/^the age filter button should show (\d+) to (\d+) in effect$/, (min, max) => {
    cy.get('[data-test="event-working-lists"]')
        .contains(truncateFilterLabelForTest(`Age (years): ${min} to ${max}`))
        .should('exist');
});

Then('the pagination for the event working list should show the second page', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Page 2')
        .should('exist');
});

Then('the pagination for the tei working list should show the second page', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Page 2')
        .should('exist');
});

Then('the sort arrow should indicate ascending order', () => {
    cy.get('[data-test="table-row"]').within(() => {
        cy.get('[data-test="table-row-asc"]').should('exist');
    });
});

Then('the enrollment status filter button should show that the active filter is in effect', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains(truncateFilterLabelForTest('Enrollment status: Active'))
        .should('exist');
});

When('you set the enrollment status filter to active', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Enrollment status')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Active')
        .click();
});

When(/^you set the first name filter to (.*)$/, (name) => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('First name')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[type="text"]')
        .type(name)
        .blur();
});

When('you apply the current filter', () => {
    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Then('the first name filter button should show that the filter is in effect', () => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('First name: John')
        .should('exist');
});

When('you click the first page button', () => {
    cy.get('[data-test="search-pagination-first-page"]')
        .click();
});

Then('the sort arrow should indicate descending order', () => {
    cy.get('[data-test="table-row"]').within(() => {
        cy.get('[data-test="table-row-desc"]').should('exist');
    });
});

Then('rows per page should be set to 15', () => {
    cy.get('div[data-test="rows-per-page-selector"]')
        .contains('15')
        .should('exist');
});

When('you change rows per page to 10', () => {
    cy.get('div[data-test="rows-per-page-selector"]')
        .click()
        .get('[role="option"]:visible')
        .contains('10')
        .click();
});

When(/^you select the first (.*) rows$/, (rows) => {
    cy.get('[data-test="online-list-table"]').within(() => {
        cy.get('[data-test="dhis2-uicore-tablebody"]')
            .find('tr')
            .each(($tr, index) => {
                if (index < rows) {
                    cy.wrap($tr).find('[data-test="select-row-checkbox"]').click();
                }
            });
    });
});

Then(/^the bulk action bar should say (.*) selected$/, (rows) => {
    cy.get('[data-test="bulk-action-bar"]')
        .contains(`${rows} selected`);
});

Then(/^the first (.*) rows should be selected$/, (rows) => {
    cy.get('[data-test="online-list-table"]').within(() => {
        cy.get('[data-test="dhis2-uicore-tablebody"]')
            .find('tr')
            .each(($tr, index) => {
                if (index < rows) {
                    cy.wrap($tr)
                        .should('have.class', 'selected')
                        .find('[data-test="select-row-checkbox"]');
                }
            });
    });
});

When('you select all rows', () => {
    cy.get('[data-test="select-all-rows-checkbox"]').click();
});

Then('all rows should be selected', () => {
    cy.get('[data-test="online-list-table"]').within(() => {
        cy.get('[data-test="dhis2-uicore-tablebody"]')
            .find('tr')
            .each(($tr) => {
                cy.wrap($tr)
                    .should('have.class', 'selected')
                    .find('[data-test="select-row-checkbox"]');
            });
    });
});

Then('the bulk action bar should not be present', () => {
    cy.get('[data-test="bulk-action-bar"]').should('not.exist');
});

Then('no rows should be selected', () => {
    cy.get('[data-test="dhis2-uicore-tablebody"]')
        .find('tr')
        .each(($tr) => {
            cy.wrap($tr).should('not.have.class', 'selected');
        });
});

When(/^you deselect the first (.*) rows$/, (rows) => {
    cy.get('[data-test="dhis2-uicore-tablebody"]')
        .find('tr')
        .each(($tr, index) => {
            if (index < rows) {
                cy.wrap($tr).find('[data-test="select-row-checkbox"]').click();
            }
        });
});

Then('the filters should be disabled', () => {
    cy.get('[data-test="workinglist-template-selector-chip"]')
        .each(($chip) => {
            cy.wrap($chip).should('have.class', 'disabled');
        });
});

When(/^you click the bulk (.*) button$/, (text) => {
    cy.get('[data-test="bulk-action-bar"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains(text, { matchCase: false })
        .click();
});

When('you refresh the page', () => {
    cy.reload();
});

When(/^you open the saved view (.+)$/, (viewName) => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains(viewName)
        .click();
});

Then(/^you can load the view with the name ?(.*)$/, (name) => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .within(() => {
            cy.contains(name).click();
        });
});

When('you change the sharing settings', () => {
    cy.get('[data-test="list-view-menu-button"]').click();
    cy.contains('Share view').click();
    cy.get('[placeholder="Search"]').type('Boateng');
    cy.contains('Kevin Boateng').click();
    cy.contains('Choose a level').click();
    cy.contains('View and edit').click({ force: true });
    cy.get('[data-test="dhis2-uicore-button"]').contains('Give access').click({ force: true });
    cy.get('[data-test="dhis2-uicore-button"]').contains('Close').click({ force: true });
});

Then('you see the new sharing settings', () => {
    cy.get('[data-test="list-view-menu-button"]').click();
    cy.contains('Share view').click();
    cy.get('[data-test="sharing-dialog"]').within(() => {
        cy.contains('Kevin Boateng').should('exist');
        cy.contains('Close').click();
    });
    cy.get('[data-test="list-view-menu-button"]').click();
    cy.contains('Delete view').click();
    cy.contains('Confirm').click();
});

When(/^you open the More filters menu on the (event|tracker) working list$/, (listType) => {
    const dataTest = listType === 'event' ? 'event-working-lists' : 'tracker-working-lists';
    cy.get(`[data-test="${dataTest}"]`).within(() => cy.contains('More filters').click());
});

Then(/^the filter option "([^"]+)" should not appear in the More filters menu$/, (filterName) => {
    cy.get('[data-test="more-filters-menu"]').within(() => cy.contains(filterName).should('not.exist'));
});
