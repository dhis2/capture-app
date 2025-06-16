import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';

When(/^you set the assginee filter to (.*)$/, (assignedUser) => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains('Assigned to')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains(assignedUser)
        .click();
});

Then(/^the assignee filter button should show that (.*) filter is in effect/, (assignedUser) => {
    cy.get('[data-test="tracker-working-lists"]')
        .contains(`Assigned to: ${assignedUser}`)
        .should('exist');
});
