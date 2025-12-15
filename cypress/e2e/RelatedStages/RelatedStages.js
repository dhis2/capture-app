import { Given, Then, When, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
import { getCurrentYear } from '../../support/date';

Given(/^you land on a enrollment page domain by having typed (.*)$/, (url) => {
    cy.visit(url);
    cy.get('[data-test="person-selector-container"]').contains('Person');
});

And(/^the Related stages Actions is ?(.*) visible at the bottom of the page/, (not) => {
    cy.get('[data-test="related-stages-section"]')
        .should(not ? 'not.exist' : 'exist');
});

And('you select the Link to an existing event action', () => {
    cy.get('[data-test="related-stages-section"]')
        .and('contain', 'Actions - Birth to Baby postnatal');
    cy.get('[data-test="related-stages-actions-link-existing-response"]')
        .click();
});

And('you select the Schedule event action', () => {
    cy.get('[data-test="related-stages-section"]')
        .and('contain', 'Actions - Birth to Baby postnatal');
    cy.get('[data-test="related-stages-actions-schedule"]')
        .click();
});

And('you select the Enter details now action', () => {
    cy.get('[data-test="related-stages-section"]')
        .and('contain', 'Actions - Birth to Baby postnatal');
    cy.get('[data-test="related-stages-actions-enter-details"]')
        .click();
});

When('you select the first existing Baby Postnatal event in the list', () => {
    cy.get('[data-test="related-stages-existing-response-list-content"]')
        .click();
    cy.get('[data-test="dhis2-simplesingleselect-option"]')
        .eq(0)
        .click();
});

When('you click the Link button', () => {
    cy.get('[data-test="related-stages-buttons-link-existing-response"]')
        .click();
});

Then('you can see the Baby Postnatal linked event', () => {
    cy.get('[data-test="enrollment-viewEvent-page"]')
        .should('contain', 'This Birth event is linked to a Baby Postnatal event. Review the linked event details before entering data below');
});

Then('you can see the Birth linked event', () => {
    cy.get('[data-test="enrollment-editEvent-page"]')
        .should('contain', 'This Baby Postnatal event is linked to a Birth event. Review the linked event details before entering data below');
});

When('you unlink the Baby Postnatal linked event', () => {
    cy.get('[data-test="widget-linked-event-overflow-menu"]')
        .click();
    cy.get('[data-test="event-overflow-unlink-event"]')
        .click();
    cy.get('[data-test="event-overflow-unlink-event-confirm"]')
        .click();
});

And('you delete the Birth event', () => {
    cy.buildApiUrl('tracker', 'enrollments/EOxeNf2MdBf?fields=events[event,programStage]')
        .then(url => cy.request(url))
        .then(({ body }) => {
            const { events } = body;

            if (events) {
                const eventToDelete = events.find(event => event.programStage === 'A03MvHHogjR');
                if (eventToDelete) {
                    cy.buildApiUrl('tracker?async=false&importStrategy=DELETE').then((eventUrl) => {
                        cy.request('POST', eventUrl, { events: [eventToDelete] });
                        cy.reload();
                    });
                }
            }
        });
});

And('you open the Birth event edit page', () => {
    cy.get('[data-test="stages-and-events-widget"]')
        .find('[data-test="widget-contents"]')
        .contains('[data-test="stage-content"]', 'Birth')
        .find('[data-test="dhis2-uicore-datatablerow"]')
        .eq(1)
        .click();
});

And('you open the Birth new event page and fill in the required data in the form', () => {
    cy.get('[data-test="stages-and-events-widget"]')
        .find('[data-test="widget-contents"]')
        .contains('[data-test="stage-content"]', 'Birth')
        .find('[data-test="create-new-button"]')
        .click();

    cy.get('[data-test="dataentry-field-occurredAt"]')
        .within(() => {
            cy.get('input[type="text"]')
                .eq(0)
                .type(`${getCurrentYear()}-07-01`)
                .blur();
        });
});

When('you fill in the required values for the Baby postnatal event when scheduling', () => {
    cy.get('[data-test="related-stages-section"]')
        .within(() => {
            cy.get('input[type="text"]')
                .eq(0)
                .type(`${getCurrentYear()}-08-01`)
                .blur();

            cy.get('input[type="text"]')
                .eq(1)
                .type('Barmoi CH');

            cy.contains('Barmoi CHP')
                .click();
        });
});

And('you click the Schedule action button', () => {
    cy.get('[data-test="related-stages-buttons-schedule"]')
        .click();
});

When('you fill in the required values for the Baby postnatal event when entering details', () => {
    cy.get('[data-test="related-stages-section"]')
        .within(() => {
            cy.get('input[type="text"]')
                .eq(0)
                .type('Barmoi CH');

            cy.contains('Barmoi CHP')
                .click();
        });
});

And('you click the Enter details action button', () => {
    cy.get('[data-test="related-stages-buttons-enter-details"]')
        .click();
});

Then('you can see the Baby postnatal new event form', () => {
    cy.get('[data-test="edit-event-report-tab"]')
        .should('contain', 'Report');
    cy.get('[data-test="edit-event-schedule-tab"]')
        .should('contain', 'Schedule');
    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Cancel')
        .should('exist');
});

And('the schedule and enter details actions are disabled', () => {
    cy.get('input[name="related-stage-action-SCHEDULE_IN_ORG"]')
        .should('be.disabled');
    cy.get('input[name="related-stage-action-ENTER_DATA"]')
        .should('be.disabled');
});

And('the link to an existing actions is disabled', () => {
    cy.get('input[name="related-stage-action-LINK_EXISTING_RESPONSE"]')
        .should('be.disabled');
});

And('you click the Complete button', () => {
    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Complete')
        .click();
});

Then('you are redirect to the enrollment dasboard and you see the 2 linked events in different orgUnits', () => {
    cy.get('[data-test="stages-and-events-widget"]')
        .find('[data-test="widget-contents"]')
        .contains('[data-test="stage-content"]', 'Birth')
        .find('[data-test="dhis2-uicore-datatablerow"]')
        .eq(1)
        .contains('Tombo Wallah CHP');

    cy.get('[data-test="stages-and-events-widget"]')
        .find('[data-test="widget-contents"]')
        .contains('[data-test="stage-content"]', 'Baby Postnatal')
        .find('[data-test="dhis2-uicore-datatablerow"]')
        .eq(1)
        .contains('Barmoi CHP');
});

And('you fill the Child Program program registration form with unique values', () => {
    cy.get('input[type="text"]')
        .eq(1)
        .type('2021-01-01')
        .blur();
    cy.get('input[type="text"]')
        .eq(2)
        .type(20);
    cy.get('input[type="text"]')
        .eq(3)
        .type(30)
        .blur();
    cy.get('input[type="text"]')
        .eq(4)
        .type(`Sarah-${Math.round((new Date()).getTime() / 1000)}`)
        .blur();
    cy.get('input[type="text"]')
        .eq(5)
        .type(`Beth-${Math.round((new Date()).getTime() / 1000)}`)
        .blur();
    cy.get('input[type="text"]')
        .eq(7)
        .type('2021-01-01')
        .blur();
});

And('you delete the recently added tracked entity', () => {
    cy.get('[data-test="profile-widget"]')
        .contains('Person profile')
        .should('exist');
    cy.get('[data-test="tracked-entity-profile-overflow-button"]')
        .click();
    cy.contains('Delete Person')
        .click();
    cy.get('[data-test="widget-profile-delete-modal"]').within(() => {
        cy.contains('Yes, delete Person')
            .click();
    });
    cy.url().should('include', 'selectedTemplateId=IpHINAT79UW');
});

And(/^you click the save (.*) submit button$/, (TEType) => {
    cy.contains(`Save ${TEType}`)
        .click();
});

And('you navigate to the Enrollment dashboard', () => {
    cy.contains('Enrollment dashboard')
        .click();
});

And('you are in Child programme and Tombo Wallah CHP organization unit registration page', () => {
    cy.visit('/#/new?programId=IpHINAT79UW&orgUnitId=VFF7f43dJv4');
});

And(/^you delete the events of the enrollmentId (.*)$/, (enrollmentId) => {
    cy.buildApiUrl('tracker', `enrollments/${enrollmentId}?fields=events[event]`)
        .then(url => cy.request(url))
        .then(({ body }) => {
            const { events } = body;

            if (events) {
                cy.buildApiUrl('tracker?async=false&importStrategy=DELETE').then((eventUrl) => {
                    cy.request('POST', eventUrl, { events });
                    cy.reload();
                });
            }
        });
});

