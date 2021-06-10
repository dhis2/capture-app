beforeEach(() => {
    cy.loginThroughForm();
});

Given(/^you land on the enrollment event page by having typed (.*)$/, (url) => {
    cy.visit(url);
});

Then(/^you see the following (.*)$/, (message) => {
    cy.contains(message);
});
