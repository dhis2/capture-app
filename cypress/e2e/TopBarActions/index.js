import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';

Given(/^you land on a enrollment page domain by having typed (.*)$/, (url) => {
    cy.visit(url);
    cy.get('[data-test="person-selector-container"]').contains('Person');
});

When(/^the user clicks on the edit button/, () =>
    cy.get('[data-test="widget-enrollment-event"]').find('[data-test="dhis2-uicore-button"]').eq(1).click(),
);

When('the user clicks the arrow button to see the dropdown', () => {
    cy.get('[data-test="new-button-toggle"]')
        .click();
});

Then('the user sees the warning popup', () => {
    cy.contains('Discard unsaved changes?');
    cy.contains('This event has unsaved changes. Leaving this page without saving will lose these changes. Are you sure you want to discard unsaved changes?');
});

When(/^the user set the WHOMCH Diastolic blood pressure to (.*)/, score =>
    cy.get('[data-test="new-enrollment-event-form"]').find('[data-test="capture-ui-input"]').eq(6).clear()
        .type(score)
        .blur(),
);
