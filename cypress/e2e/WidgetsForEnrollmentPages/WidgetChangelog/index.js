import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given('you select view changelog in the event overflow button', () => {
    cy.get('[data-test="widget-event-edit-overflow-button"]')
        .click();

    cy.get('[data-test="event-overflow-view-changelog"] > a')
        .click({ force: true });
});

Then('the changelog modal should be visible', () => {
    cy.get('[data-test="changelog-modal"]')
        .should('be.visible');
});

Then(/^the number of changelog table rows should be (.*)$/, (numberOfRows) => {
    cy.get('[data-test="changelog-data-table-body"]')
        .within(() => {
            cy.get('tr')
                .should('have.length', numberOfRows);
        });
});

When(/^you change the page size to (.*)$/, (pageSize) => {
    cy.get('[data-test="changelog-pagination-pagesize-select"]')
        .click();

    cy.get('[data-test="dhis2-uicore-select-menu-menuwrapper"]')
        .contains(pageSize)
        .click();
});

Then('the changelog modal should contain data', () => {
    cy.get('[data-test="changelog-data-table-body"]')
        .should('be.visible');
});

When('you move to the next page', () => {
    cy.get('[data-test="changelog-pagination-page-next"]')
        .click();
});

Then(/^the table footer should display page (.*)$/, (number) => {
    cy.get('[data-test="changelog-pagination-summary"]')
        .contains(`Page ${number}`);
});
