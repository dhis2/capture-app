import '@dhis2/cli-utils-cypress/support';

import './helpers';

beforeEach(() => {
    localStorage.setItem('DHIS2_BASE_URL', Cypress.env('DHIS2_BASE_URL'));
});

before(() => {
    Cypress.Cookies.defaults({
        whitelist: 'JSESSIONID',
    });
    cy.loginThroughForm();
});
