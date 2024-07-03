import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { getCurrentYear } from '../../../support/date';
import '../sharedSteps';
import '../WidgetTab';

Then('you choose a schedule date', () => {
    cy.get('[data-test="schedule-section"]').within(() => {
        cy.get("[data-test='capture-ui-input']").eq(0).should('have.value', `${getCurrentYear()}-08-01`);
        cy.get("[data-test='capture-ui-input']").eq(0)
            .clear()
            .type(`${getCurrentYear() + 1}-08-01`)
            .blur();
    });
});

When('you click cancel in Schedule tab', () => {
    cy.get('[data-test="dhis2-uicore-button"]').contains('Cancel').click();
});

Then('you should see confirm dialog', () => {
    cy.get('aside[role="dialog"]')
        .find('[data-test="dhis2-uicore-modaltitle"]')
        .contains('Discard unsaved changes?')
        .should('exist');

    cy.get('[role="dialog"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Yes, discard changes').click({ force: true }); // Add {force:true} to disable the error due to layer parent has css display: none
});
