Cypress.Commands.add('buildApiUrl', (...urlParts) =>
    [Cypress.env('DHIS2_BASE_URL'), 'api', ...urlParts]
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

Cypress.Commands.add('loginThroughForm', (username = 'DHIS2_USERNAME', password = 'DHIS2_PASSWORD') => {
    cy.visit('/').then(() => {
        cy.get('#j_username').type(Cypress.env(username));
        cy.get('#j_password').type(Cypress.env(password));
        cy.get('form').submit();
    });

    cy.get('[data-test="dhis2-capture-locked-selector"]', { timeout: 60000 })
        .should('exist');
});
