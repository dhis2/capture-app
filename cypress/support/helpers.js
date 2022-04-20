Cypress.Commands.add('buildApiUrl', (...urlParts) =>
    [Cypress.env('dhis2BaseUrl'), 'api', ...urlParts]
        .map(part => part.replace(/(^\/)|(\/$)/, ''))
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

    cy.get('[data-test="locked-selector"]', { timeout: 60000 })
        .should('exist');
});

Cypress.Commands.add('forceVisit', (url) => {
    cy.visit(url);
    cy.window().then((win) => { win.location.href = url; });
});
