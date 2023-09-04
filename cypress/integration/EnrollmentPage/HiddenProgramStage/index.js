import moment from 'moment';

const cleanUp = () => {
    cy.visit(
        '/#/enrollment?enrollmentId=fmhIsWXVDmS&orgUnitId=s7SLtx8wmRA&programId=WSGAb5XwJ3Y&teiId=uW8Y7AIcRKA',
    );

    cy.get('[data-test="enrollment-page-content"]').contains('Enrollment Dashboard');

    cy.get('[data-test="stages-and-events-widget"]')
        .find('[data-test="stage-content"]')
        .eq(3)
        .click();

    cy.contains('WHOMCH Pregnancy outcome').should('exist');
    cy.contains('[data-test="dhis2-uicore-button"]', 'Edit event').click();
    cy.contains('[data-test="dhis2-uicore-button"]', 'Delete').click();
    cy.contains('[data-test="dhis2-uicore-button"]', 'Yes, delete event').click();
};

Given('you add an enrollment event that will result in a rule effect to hide a program stage', () => {
    cleanUp();
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

Then('and an error is show in the Postpartum care visit stage', () => {
    cy.visit(
        '/#/enrollmentEventNew?enrollmentId=fmhIsWXVDmS&orgUnitId=s7SLtx8wmRA&programId=WSGAb5XwJ3Y&teiId=uW8Y7AIcRKA&stageId=bbKtnxRZKEP',
    );
    cy.contains('[data-test="dhis2-uicore-button"]', 'Complete')
        .should('be.disabled');
    cy.contains('[data-test="dhis2-uicore-button"]', 'Save without completing')
        .should('be.disabled');
    cy.contains('[data-test="dhis2-uicore-noticebox-content"]', 'You can\'t add any more Postpartum care visit events')
        .should('exist');
});

Then('the Postpartum care visit button is disabled in the enrollmentEventNew page', () => {
    cy.visit(
        '/#/enrollmentEventNew?enrollmentId=fmhIsWXVDmS&orgUnitId=s7SLtx8wmRA&programId=WSGAb5XwJ3Y&teiId=uW8Y7AIcRKA',
    );

    cy.contains('[data-test="program-stage-selector-button"]', 'Postpartum care visit').should('be.disabled');
});
