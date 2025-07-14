import { defineStep as And, Given, Then, When, Before } from '@badeball/cypress-cucumber-preprocessor';
import { getCurrentYear } from '../../../support/date';

Before({ tags: '@with-restore-event-schedule-date' }, () => {
    cy.buildApiUrl('tracker', 'events/RIrfCcEP8Uu')
        .then(url => cy.request(url))
        .then((apiResponse) => {
            const event = apiResponse.body;
            const eventToUpdate = { ...event, scheduledAt: `${getCurrentYear() - 15}-01-07` };
            return cy
                .buildApiUrl('tracker?async=false&importStrategy=UPDATE')
                .then(eventUrl => cy.request('POST', eventUrl, { events: [eventToUpdate] }));
        });
});

const changeEnrollmentAndEventsStatus = () => (
    cy.buildApiUrl(
        'tracker',
        'trackedEntities/JM29jwvw8Ub?program=qDkgAbB5Jlk&fields=enrollments[enrollment,events,orgUnit,program,enrolledAt,trackedEntity]',
    )
        .then(url => cy.request(url))
        .then(({ body }) => {
            const enrollment = body.enrollments && body.enrollments.find(e => e.enrollment === 'C4iB0VTbfrK');
            const eventToUpdate = enrollment.events.find((e => e.programStage === 'eHvTba5ijAh'));
            const enrollmentToUpdate = {
                ...enrollment,
                status: 'ACTIVE',
                completedAt: null,
                completedBy: null,
                events: [{ ...eventToUpdate, status: 'ACTIVE', completedAt: null, completedBy: null }],
            };

            return cy
                .buildApiUrl('tracker?async=false&importStrategy=UPDATE')
                .then(enrollmentUrl => cy.request('POST', enrollmentUrl, { enrollments: [enrollmentToUpdate] }))
                .then(() => {
                    cy.reload();
                    cy.get('[data-test="widget-enrollment"]').within(() => {
                        cy.get('[data-test="widget-enrollment-status"]').contains('Active').should('exist');
                    });
                });
        })
);

And('the apgar score is 11', () => {
    cy.buildApiUrl('tracker', 'events/V1CerIi3sdL')
        .then(url => cy.request(url))
        .then(({ body }) => {
            const { dataValues, ...rest } = body;
            const dataValuesToUpdate = dataValues.map(dataValue => (
                dataValue.dataElement === 'a3kGcGDCuk6' ? { ...dataValue, value: 11 } : dataValue
            ));
            const eventToUpdate = { ...rest, dataValues: dataValuesToUpdate };

            return cy
                .buildApiUrl('tracker?async=false&importStrategy=UPDATE')
                .then(url => cy.request('POST', url, { events: [eventToUpdate] }))
                .then(() => {
                    cy.reload();
                    cy.get('[data-test="widget-enrollment-event"]')
                        .find('[data-test="form-field"]')
                        .contains('11')
                        .should('exist');
                });
        });
});

Given(/^you land on the enrollment event page with selected (.*) by having typed (.*)$/, (tet, url) => {
    cy.visit(url);
    cy.get('[data-test="scope-selector"]').contains(`${tet}`);
});

When(/^the user clicks on the edit button/, () =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="widget-enrollment-event-edit-button"]')
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
        .find('input[type="text"]')
        .eq(2)
        .clear()
        .type(score)
        .blur(),
);

When(/^the user changes the gender to (.*)/, gender =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .get('[data-test="dhis2-uicore-singleselect"]')
        .eq(0)
        .click()
        .contains(gender)
        .click(),
);

When(/^the user sets Plurality assessed to (.*)/, (text) => {
    cy.get('[data-test="widget-enrollment-event"]')
        .get('[data-test="scope-selector"]')
        .get('[data-test="dhis2-uicore-singleselect"]')
        .eq(4)
        .click();

    cy.get('[data-test="dhis2-uicore-singleselectoption"]')
        .contains(text)
        .click({ force: true });
});

When('the user clicks switch tab to Schedule', () => {
    cy.get('[data-test="edit-event-tab-bar"]').get('button').contains('Schedule').click();
});

Then('the user selects another schedule date', () => {
    cy.get('[data-test="schedule-section"]').within(() => {
        cy.get('input[type="text"]').eq(0).should('have.value', `${getCurrentYear() - 15}-01-07`);
        cy.get('input[type="text"]').eq(0)
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

And('the enrollment status is active', () => {
    changeEnrollmentAndEventsStatus();
});

And('the user completes the event', () => {
    cy.get('[data-test="dataentry-field-complete"]')
        .find('input')
        .click()
        .blur();

    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Save')
        .click();
});

When('the user completes the enrollment', () => {
    cy.get('[data-test="enrollment-complete-modal"]').within(() => {
        cy.contains('Case outcome completed').should('exist');
        cy.contains('Would you like to complete the enrollment and all active events as well?').should('exist');
        cy.contains('The following events will be completed:').should('exist');
        cy.contains('1 event in Case outcome').should('exist');
        cy.contains('1 event in Diagnosis & treatment').should('exist');
        cy.contains('No, cancel').should('exist');
        cy.contains('Complete enrollment only').should('exist');
        cy.contains('Yes, complete enrollment and events').should('exist');
    });
    cy.get('[data-test="enrollment-actions-complete-button"]').click();
});

Then('the user sees the enrollment status and recently edited event in Case outcome event status is completed', () => {
    cy.url().should('include', `${Cypress.config().baseUrl}/#/enrollment?`);
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-status"]').contains('Completed').should('exist');
    });

    cy.get('[data-test="stage-content"]')
        .eq(2)
        .within(() => {
            cy.get('[data-test="dhis2-uicore-tag-text"]').contains('Completed').should('exist');
        });
    changeEnrollmentAndEventsStatus();
});

Then('you are redirected to the enrollment dashboard', () => {
    cy.url().should('include', `${Cypress.config().baseUrl}/#/enrollment?`);
});

And('you open the Birth stage event', () => {
    cy.get('[data-test="stage-content"]')
        .eq(0)
        .within(() => {
            cy.get('[data-test="dhis2-uicore-datatablerow"]')
                .eq(1)
                .click();
        });
});

Then('the edit button should be disabled', () => {
    cy.get('[data-test="widget-enrollment-event"]')
        .find('[data-test="widget-enrollment-event-edit-button"]')
        .should('be.disabled');
});

And('the add event form is displayed', () => {
    cy.get('[data-test="add-event-enrollment-page-content"]').should('exist');
});

And('the user is navigated to the enrollment dashboard', () => {
    cy.get('[data-test="enrollment-overview-page"]').should('exist');
});

And(/^the view enrollment event form is in (.*) mode$/, (mode) => {
    cy.get(`[data-test="widget-enrollment-event-${mode}"]`).should('exist');
});
