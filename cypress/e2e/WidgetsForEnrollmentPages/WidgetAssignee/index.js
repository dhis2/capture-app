import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given(/^you make sure the event (.+) has no assigned user$/, (eventId) => {
    cy.buildApiUrl('tracker', `events/${eventId}`)
        .then(url => cy.request(url))
        .then(({ body }) => {
            if (!body.assignedUser) {
                return undefined;
            }

            const eventToUpdate = { ...body, assignedUser: null };

            return cy
                .buildApiUrl('tracker?async=false&importStrategy=UPDATE')
                .then(eventUrl => cy.request('POST', eventUrl, { events: [eventToUpdate] }));
        });
});

When('you assign the user Geetha in the view mode', () => {
    cy.get('[data-test="widget-assignee"]').within(() => {
        cy.get('[data-test="widget-assignee-assign"]').click();
        cy.get('input[type="text"]').type('Geetha');
        cy.contains('Geetha Alwan').click();
        cy.get('[data-test="widget-assignee-save"]').click();
    });
});

When('you assign the user Tracker demo User in the edit mode', () => {
    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="widget-enrollment-event-edit-button"]')
        .click();

    cy.get('[data-test="widget-assignee"]').within(() => {
        cy.get('[data-test="widget-assignee-assign"]').click();
        cy.get('input[type="text"]').type('Tracker demo');
        cy.contains('Tracker demo User').click();
        cy.get('[data-test="widget-assignee-save"]').click();
    });
});

When('you remove the assigned user', () => {
    cy.get('[data-test="widget-assignee"]').within(() => {
        cy.get('[data-test="widget-assignee-edit"]').click();
        cy.get('[data-test="dhis2-uicore-chip-remove"]').click();
        cy.get('[data-test="widget-assignee-save"]').click();
    });
});

Then('the event has the user Geetha Alwan assigned', () => {
    cy.get('[data-test="widget-assignee"]').within(() => {
        cy.get('[data-test="widget-contents"]').contains('Geetha Alwan').should('exist');
    });
});

Then('the event has the user Tracker demo User assigned', () => {
    cy.get('[data-test="widget-assignee"]').within(() => {
        cy.get('[data-test="widget-contents"]').contains('Tracker demo User').should('exist');
    });
});

Then('the event has no assignd user', () => {
    cy.get('[data-test="widget-assignee"]').within(() => {
        cy.get('[data-test="widget-contents"]').contains('No one is assigned to this event').should('exist');
    });
});
