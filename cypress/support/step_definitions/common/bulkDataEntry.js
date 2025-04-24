import { Then, When, Before } from '@badeball/cypress-cucumber-preprocessor';

Before({ tags: '@with-indexBD-clean' }, () => {
    cy.cleanIndexBD();
});

Then('the BulkDataEntry widget in idle mode is displayed', () => {
    cy.get('[data-test="widget-bulk-data-entry-idle"]').within(() => {
        cy.contains('Bulk data entry').should('exist');
    });
});

When('the user selects the {string} BulkDataEntry', (optionName) => {
    cy.get('[data-test="widget-bulk-data-entry-idle"]').within(() => {
        cy.contains(optionName).click();
    });
});

When('the user navigates to {string} using the breadcrumb', (text) => {
    cy.get('[data-test="bulkDataEntry-breadcrumb"]').contains(text).click();
});

Then('the BulkDataEntry widget in active mode is displayed', () => {
    cy.get('[data-test="widget-bulk-data-entry-active"]').within(() => {
        cy.get('[data-test="dhis2-uicore-button"]').contains('Continue data entry');
        cy.get('[data-test="dhis2-uicore-tag-text"]').contains('Unsaved changes');
    });
});
