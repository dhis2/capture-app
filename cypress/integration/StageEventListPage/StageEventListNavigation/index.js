beforeEach(() => {
    cy.loginThroughForm();
});

Given('you are visiting Stage Event List Page by url', () => {
    cy.visit('/#/enrollment/stageEvents?enrollmentId=wBU0RAsYjKE&stageId=A03MvHHogjR&orgUnitId=DiszpKrYNg8');
});

Then('you should see the content of the page', () => {
    cy.get('[data-test="stage-event-list"]')
        .contains('Stages and Events')
        .should('exist');
});
