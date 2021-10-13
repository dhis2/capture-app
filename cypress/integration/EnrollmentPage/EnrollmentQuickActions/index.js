beforeEach(() => {
    cy.loginThroughForm();
});

Given('you are on an enrollment page', () => {
    cy.visit('/#/enrollment?programId=IpHINAT79UW&orgUnitId=UgYg0YW7ZIh&teiId=fhFQhO0xILJ&enrollmentId=gPDueU02tn8');
    cy.get('[data-test="enrollment-page-content"]')
        .contains('Enrollment Dashboard');
});

When(/^you click the (.*) event-button/, (mode) => {
    cy.get(`[data-test=quick-action-button-${mode}]`)
        .click();
});

Then(/^you should be navigated to the (.*) tab/, (tab) => {
    cy.url()
        .should('include', 'enrollmentEventNew')
        .should('include', `tab=${tab.toUpperCase()}`);
});
