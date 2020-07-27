import '@dhis2/cli-utils-cypress/support';


Cypress.Commands.add(
    'shouldIncludeClass',
    { prevSubject: true },
    (subject, className) =>
        cy.wrap(subject)
            .invoke('attr', 'class')
            .should('contain', className),
);
