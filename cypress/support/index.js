import '@dhis2/cli-utils-cypress/support';

// Add additional support functions here
import './login';
import './helpers';

Cypress.Commands.add(
    'shouldIncludeClass',
    { prevSubject: true },
    (subject, className) =>
        cy.wrap(subject)
            .invoke('attr', 'class')
            .should('contain', className),
);
