import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('you are visiting Stage Event List Page by url', () => {
    cy.visit('/#/enrollment/stageEvents?enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR&orgUnitId=DiszpKrYNg8&programId=IpHINAT79UW');
});

Then('you should see the content of the page', () => {
    cy.get('[data-test="stage-event-list"]')
        .contains('Birth')
        .should('exist');
});
