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

Cypress.Commands.add('loginThroughForm', () => {
    const username = Cypress.env('DHIS2_USERNAME');
    const password = Cypress.env('DHIS2_PASSWORD');
    cy.visit('/').then(() => {
        cy.get('#j_username').type(username);
        cy.get('#j_password').type(password);
        cy.get('form').submit();
    });

    cy.get('[data-test="dhis2-capture-locked-selector"]', { timeout: 60000 })
        .should('exist');
});
