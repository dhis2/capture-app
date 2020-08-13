const loginEndPoint = 'dhis-web-commons/security/login.action';

/**
 * This is done through cy.request(...)
 * because Cypress doesn't allow multiple domains per test:
 * https://docs.cypress.io/guides/guides/web-security.html#One-Superdomain-per-Test
 */
Cypress.Commands.add('login', () => {
    // AuthBoundary
    const username = Cypress.env('DHIS2_USERNAME');
    const password = Cypress.env('DHIS2_PASSWORD');
    const loginUrl = Cypress.env('DHIS2_BASE_URL');
    const loginAuth = `Basic ${btoa(`${username}:${password}`)}`;

    return cy.request({
        url: `${loginUrl}/${loginEndPoint}`,
        method: 'POST',
        body: {
            j_username: username,
            j_password: password,
            '2fa_code': '',
        },
        headers: { Authorization: loginAuth },
    });
});
