import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('for an event program the page navigation should show that you are on the first page', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Page 1')
        .should('exist');
});

Then('for a tracker program the page navigation should show that you are on the first page', () => {
    cy.get('[data-test="tei-working-lists"]')
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

When('you set the age filter to 10-20', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Age (years)')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Min"]')
        .type('10');

    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Max"]')
        .type('20');
});

Then('the age filter button should show that the filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Age (years): 10 to 20')
        .should('exist');
});

Then('the pagination for the event working list should show the second page', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Page 2')
        .should('exist');
});

Then('the pagination for the tei working list should show the second page', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Page 2')
        .should('exist');
});

Then('the sort arrow should indicate ascending order', () => {
    cy.get('[data-test="table-row"]').within(() => {
        cy.get('[data-test="table-row-asc"]').should('exist');
    });
});

Then('the enrollment status filter button should show that the active filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Enrollment status: Active')
        .should('exist');
});

When('you set the enrollment status filter to active', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Enrollment status')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Active')
        .click();
});

When(/^you set the first name filter to (.*)$/, (name) => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('First name')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .find('input')
        .type(name)
        .blur();
});

When('you apply the current filter', () => {
    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Then('the first name filter button should show that the filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
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
