Cypress.Commands.add('buildApiUrl', (...urlParts) =>
    [Cypress.env('DHIS2_BASE_URL'), 'api', ...urlParts]
        .map(part => part.replace(/(^\/)|(\/$)/, ''))
        .join('/'),
);
