import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { getCurrentYear } from '../../../support/date';
import '../../sharedSteps';

Given(/^you land on the enrollment event page with selected (.*) by having typed (.*)$/, (tet, url) => {
    cy.visit(url);
    cy.get('[data-test="scope-selector"]').contains(`${tet}`);
});

When(/^the user clicks on the edit button/, () =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="dhis2-uicore-button"]')
        .eq(1)
        .click(),
);

When(/^the user clicks on the save button/, () =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Save')
        .click(),
);

When(/^the user clicks on the cancel button/, () =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Cancel')
        .click(),
);

When(/^the user set the apgar score to (.*)/, score =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="capture-ui-input"]')
        .eq(2)
        .clear()
        .type(score)
        .blur(),
);

When(/^the user changes the gender to (.*)/, gender =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .get('[data-test="virtualized-select"]')
        .eq(0)
        .click()
        .contains(gender)
        .click(),
);

When(/^the user sets Plurality assessed to (.*)/, text =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .get('[data-test="virtualized-select"]')
        .eq(4)
        .click()
        .contains(text)
        .click(),
);

When('the user clicks switch tab to Schedule', () => {
    cy.get('[data-test="edit-event-tab-bar"]').get('button').contains('Schedule').click();
});

Then('the user selects another schedule date', () => {
    cy.get('[data-test="schedule-section"]').within(() => {
        cy.get("[data-test='capture-ui-input']").eq(0).should('have.value', `${getCurrentYear() - 15}-01-07`);
        cy.get("[data-test='capture-ui-input']").eq(0)
            .clear()
            .type(`${getCurrentYear()}-08-01`)
            .blur();
    });
});

Then(/^the user clicks on the schedule button on (.*)$/, (widgetName) => {
    cy
        .get(`[data-test="${widgetName}"]`)
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Schedule')
        .click();
});

Then('the user see the schedule date and info box', () => {
    cy.get('[data-test="schedule-section"]').within(() => {
        cy.contains('Schedule date / Due date');
        cy.contains(`Scheduled automatically for ${getCurrentYear() - 1}-10-16`);
    });
});

Then(/^the user see the schedule date field with tooltip: (.*)$/, (tooltipContent) => {
    cy.get('[data-test="dhis2-uicore-tooltip-reference"]').eq(0).trigger('mouseover');
    cy.get('[data-test="dhis2-uicore-tooltip-content"]').contains(tooltipContent).should('exist');
});
