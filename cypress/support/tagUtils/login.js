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
