import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';
import '../WidgetEnrollment';
import '../WidgetProfile';
import '../WidgetTab';

Then('you can assign a user when scheduling the event', () => {
    cy.get('[data-test="assignee-section"]').within(() => {
        cy.get('[data-test="capture-ui-input"]').click();
        cy.get('[data-test="capture-ui-input"]').type('Tracker demo');
        cy.contains('Tracker demo User').click();
    });
    cy.get('[data-test="assignee-section"]').within(() => {
        cy.get('[data-test="dhis2-uicore-chip"]').contains('Tracker demo User').should('exist');
    });
});

When(/^the user clicks the "Back to all stages and events" button/, () =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .contains('Back to all stages and events')
        .click(),
);

When(/^the user clicks the "New Event" button/, () =>
    cy
        .get('[data-test="quick-action-button-report"]')
        .contains('New Event')
        .click(),
);
