import '@dhis2/cli-utils-cypress/support';

const includesClass = (subject, className) =>
    cy.wrap(subject)
        .invoke('attr', 'class')
        .should('contain', className);

Cypress.Commands.add(
    'includesClass',
    { prevSubject: true },
    includesClass,
);
