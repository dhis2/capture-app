Cypress.Commands.add('buildUrl', (...urlParts) =>
    urlParts
        .map(part => part.replace(/(^\/)|(\/$)/, ''))
        .join('/'),
);
