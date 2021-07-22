beforeEach(() => {
    cy.loginThroughForm();
});

Given(/^you land on the enrollment event page by having typed (.*)$/, (url) => {
    cy.visit(url);
});

Then(/^you see the following (.*)$/, (message) => {
    cy.contains(message);
});

Then(/^you see the widget with data-test (.*)$/, (datatest) => {
    cy.get(`[data-test="${datatest}"]`).should('exist');
});
