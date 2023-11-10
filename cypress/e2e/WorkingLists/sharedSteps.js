import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

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

Then('the assigned to filter button should show that the anyone filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Assigned to: Anyone')
        .should('exist');
});

When('you set the assignee filter to anyone', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Assigned to')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Anyone')
        .click();
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

When('you set the assginee filter to none', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Assigned to')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('None')
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

Then('the assignee filter button should show that unassigned filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Assigned to: None')
        .should('exist');
});

When('you change rows per page to 10', () => {
    cy.get('div[data-test="rows-per-page-selector"]')
        .click()
        .contains('10')
        .click();
});
