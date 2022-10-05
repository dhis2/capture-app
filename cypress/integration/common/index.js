import { Before } from 'cypress-cucumber-preprocessor/steps';
import { filterInstanceVersion, shouldLogin } from '../../support/tagUtils';


let skip;
Before(() => {
    filterInstanceVersion(skip);
    shouldLogin() && cy.loginThroughForm();
});

beforeEach(function callback() {
    /*
        Cypress automatically clears all cookies between tests except cross domain cookies.
        When we are working with a remote instance, we need to clear the login cookie associated with the remote domain.
        Currently, calling clearCookies with domain:null is a workaround to get rid of the cross domain cookies.
        Related Cypress issue https://github.com/cypress-io/cypress/issues/408
    */
    cy.clearCookies({ domain: null });
    skip = this.skip.bind(this);
});
