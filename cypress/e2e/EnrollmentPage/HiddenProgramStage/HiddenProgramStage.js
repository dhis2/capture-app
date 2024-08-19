import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import moment from 'moment';

const cleanUpIfApplicable = () => {
    cy.buildApiUrl(
        'tracker',
        'trackedEntities/uW8Y7AIcRKA?program=WSGAb5XwJ3Y&fields=enrollments',
    )
        .then(url => cy.request(url))
        .then(({ body }) => {
            // TODO - Cypress does not handle optional chaining - figure out why
            const enrollment = body.enrollments && body.enrollments.find(e => e.enrollment === 'fmhIsWXVDmS');
            const event = enrollment && enrollment.events && enrollment
                .events
                .find(e => e.programStage === 'PFDfvmGpsR3');
            if (!event) {
                return null;
            }
            return cy.buildApiUrl('tracker?async=false&importStrategy=DELETE')
                .then(eventUrl =>
                    cy.request('POST', eventUrl, { events: [{ event: event.event }] }));
        });
};

Given('you add an enrollment event that will result in a rule effect to hide a program stage', () => {
    cleanUpIfApplicable();
    cy.visit(
        '/#/enrollmentEventNew?enrollmentId=fmhIsWXVDmS&orgUnitId=s7SLtx8wmRA&programId=WSGAb5XwJ3Y&stageId=PFDfvmGpsR3&teiId=uW8Y7AIcRKA',
    );

    cy.get('[data-test="capture-ui-input"]')
        .eq(0)
        .type(moment().format('YYYY-MM-DD'))
        .blur();

    cy
        .get('[data-test="virtualized-select"]')
        .eq(6)
        .click()
        .contains('Termination of pregnancy')
        .click();

    cy.contains('[data-test="dhis2-uicore-button"]', 'Save without completing').click();
});

Then('the Postpartum care visit stage should not be displayed in the Stages and Events widget', () => {
    cy.get('[data-test="stages-and-events-widget"]').should('not.contain', 'Postpartum care visit');
});

Then('the Postpartum care visit button is disabled in the enrollmentEventNew page', () => {
    cy.visit(
        '/#/enrollmentEventNew?enrollmentId=fmhIsWXVDmS&orgUnitId=s7SLtx8wmRA&programId=WSGAb5XwJ3Y&teiId=uW8Y7AIcRKA',
    );

    cy.contains('[data-test="program-stage-selector-button"]', 'Postpartum care visit').should('be.disabled');
});
