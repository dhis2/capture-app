Cypress.Commands.add('buildApiUrl', (...urlParts) =>
    [Cypress.env('dhis2BaseUrl'), 'api', ...urlParts]
        .map(part => part.replace(/(^\/)|(\/$)/g, ''))
        .join('/'),
);

Cypress.Commands.add(
    'shouldIncludeClass',
    { prevSubject: true },
    (subject, className) =>
        cy.wrap(subject)
            .invoke('attr', 'class')
            .should('contain', className),
);

Cypress.Commands.add('loginThroughForm', (username = 'dhis2Username', password = 'dhis2Password') => {
    cy.visit('/').then(() => {
        cy.get('#j_username').type(Cypress.env(username));
        cy.get('#j_password').type(Cypress.env(password));
        cy.get('form').submit();
    });

    cy.get('[data-test="scope-selector"]', { timeout: 60000 })
        .should('exist');
});

Cypress.Commands.add('forceVisit', (url) => {
    cy.visit(url);
    cy.window().then((win) => { win.location.href = url; });
});

Cypress.Commands.add('cleanIndexBD', () => {
    cy.window().then(win =>
        win.indexedDB.databases().then(db => db.forEach(database => win.indexedDB.deleteDatabase(database.name))),
    );
});

// overrides loginByApi from @dhis2/cypress-commands
// temporary solution: should use solution from @dhis2/cypres-commands when available
Cypress.Commands.add('loginByApi', ({ username, password, baseUrl }) => {
    const versionMatch = /[.](\d+)/.exec(Cypress.env('dhis2InstanceVersion') || '2.42');
    const currentInstanceVersion = Number(versionMatch ? versionMatch[1] : '42');

    if (currentInstanceVersion >= 42) {
        cy.request({
            url: `${baseUrl}/api/auth/login`,
            method: 'POST',
            followRedirect: true,
            body: {
                username,
                password,
            },
        });
    } else {
        cy.request({
            url: `${baseUrl}/dhis-web-commons-security/login.action`,
            method: 'POST',
            form: true,
            followRedirect: true,
            body: {
                j_username: username,
                j_password: password,
                '2fa_code': '',
            },
        });
    }

    // Set base url for the app platform
    window.localStorage.setItem('DHIS2_BASE_URL', baseUrl);
});
