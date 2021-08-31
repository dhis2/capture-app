import '../sharedSteps';

beforeEach(() => {
    cy.loginThroughForm();
});

Given(/^you land on the enrollment page by having typed the (.*)$/, (url) => {
    cy.visit(url);
});
