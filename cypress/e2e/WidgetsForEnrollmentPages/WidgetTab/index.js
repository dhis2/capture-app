import { When, Then, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
import { getCurrentYear } from '../../../support/date';

Then(/you should see tabs: (.*)/, (tabNames) => {
    const tabs = tabNames.split(',');
    cy.get('[data-test="add-event-enrollment-page-content"]').within(() => {
        cy.get('[data-test="new-event-tab-bar"]').should('exist');
        cy.get('[data-test="new-event-tab-bar"]').within(() => {
            tabs.forEach((tab) => {
                cy.get('button').contains(tab).should('exist');
            });
        });
    });
});


When(/you click switch tab to (.*)/, (tabName) => {
    cy.get('[data-test="new-event-tab-bar"]').get('button').contains(tabName).click();
});

Then('you should see Schedule tab', () => {
    cy.get('[data-test="new-event-schedule-tab"]').should('have.class', 'selected');
});

And(/you should see suggested date: (.*)/, (date) => {
    cy.get('[data-test="schedule-section"]').within(() => {
        cy.get('[data-test="capture-ui-input"]').should('have.value', `${getCurrentYear()}-${date}`);
    });
});
