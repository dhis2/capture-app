import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given(/^you open the enrollment page by typing (.*)$/, url =>
    cy.visit(url),
);

Given('you land on the EnrollmentEventNew-page without a stageId', () => {
    cy.visit('/#/enrollmentEventNew?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8&teiId=x2kJgpb0XQC&enrollmentId=RiNIt1yJoge');
});

When('the user clicks the Baby Postnatal-button', () => {
    cy.get('[data-test=program-stage-selector-button]')
        .eq(1)
        .click();
});

Then('the URL should contain stageId', () => {
    cy.url()
        .should('include', 'stageId=ZzYYXq4fJie');
});

Then('the stage-button should be disabled', () => {
    cy.get('[data-test=program-stage-selector-button]')
        .eq(0)
        .should('be.disabled');
});
