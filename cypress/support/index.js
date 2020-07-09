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
const isOnMainPage = () =>
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/`);

Cypress.Commands.add(
    'isOnMainPage',
    isOnMainPage,
);
