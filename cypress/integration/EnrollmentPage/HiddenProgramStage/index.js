import moment from 'moment';

const cleanUpIfApplicable = () => {
    cy.buildApiUrl(
        'tracker',
        'trackedEntities/uW8Y7AIcRKA?program=WSGAb5XwJ3Y&fields=enrollments',
    )
        .then(url => cy.request(url))
        .then(({ body }) => {
            const enrollment = body.enrollments?.find(e => e.enrollment === 'fmhIsWXVDmS');
            const event = enrollment?.events?.find(e => e.programStage === 'PFDfvmGpsR3');
            if (!event) {
                return null;
            }
            return cy
                .buildApiUrl('events', event.event)
                .then(eventUrl =>
                    cy.request('DELETE', eventUrl));
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

Then('the New Postpartum care visit event button is disabled in the stages and events widget', () => {
    cy.contains('[data-test="create-new-button"]', 'New Postpartum care visit event')
        .should('be.disabled');
});

Then('the Postpartum care visit button is disabled in the enrollmentEventNew page', () => {
    cy.visit(
        '/#/enrollmentEventNew?enrollmentId=fmhIsWXVDmS&orgUnitId=s7SLtx8wmRA&programId=WSGAb5XwJ3Y&teiId=uW8Y7AIcRKA',
    );

    cy.contains('[data-test="program-stage-selector-button"]', 'Postpartum care visit').should('be.disabled');
});
