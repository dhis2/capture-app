const loginUser = (_username) => {
    const username = _username ? Cypress.env(`dhis2Username_${_username}`) : Cypress.env('dhis2Username');
    const password = _username ? Cypress.env(`dhis2Password_${_username}`) : Cypress.env('dhis2Password');
    const baseUrl = Cypress.env('dhis2BaseUrl');

    cy.session(
        `user${username}`,
        () => {
            // Not using the login form to log in as that's the
            // recommendation by cypress:
            // * https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Fully-test-the-login-flow----but-only-once
            // * https://docs.cypress.io/api/commands/session#Multiple-login-commands
            cy.loginByApi({ username, password, baseUrl });
            // The app-adapter reads DHIS2_BASE_URL from IndexedDB first (before
            // localStorage), so a stale URL cached there from a previous manual
            // login will bypass any localStorage fix entirely. We delete the db
            // before app scripts run via onBeforeLoad so the app falls through to
            // the localStorage value we set here.
            // cy.visit inside cy.session does not resolve relative URLs via
            // Cypress's baseUrl — must pass an absolute URL.
            cy.visit(Cypress.config('baseUrl'), {
                onBeforeLoad(win) {
                    win.indexedDB.deleteDatabase('dhis2-base-url-db');
                    win.localStorage.setItem('DHIS2_BASE_URL', baseUrl);
                },
            });
        },
        {
            cacheAcrossSpecs: true,
            validate: () => {
                cy.validateUserIsLoggedIn({ baseUrl, username });
            },
        },
    );
};

export const login = () => {
    const { tags } = window.testState.pickle;

    if (tags && tags.some(tag => tag.name === '@skip-login')) {
        return;
    }

    const tagKey = '@user:';
    const userTag = tags ? tags.find(({ name }) => name.startsWith(tagKey)) : undefined;
    loginUser(userTag && userTag.name.replace(tagKey, ''));
};
