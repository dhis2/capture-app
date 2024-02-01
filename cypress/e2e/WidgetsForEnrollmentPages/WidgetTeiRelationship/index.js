import { When, Given, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

Before({ tags: '@with-mocked-relationship-data' }, () => {
    cy.intercept({
        method: 'GET',
        url: '**/tracker/relationships**',
    }, {
        statusCode: 200,
        body: {
            instances: [
                {
                    relationship: 'mwswG3RMNuu',
                    relationshipType: 'XdP5nraLPZ0',
                    createdAt: '2024-02-01T11:50:25.479',
                    from: {
                        trackedEntity: {
                            trackedEntity: 'EaOyKGOIGRp',
                            trackedEntityType: 'nEenWmSyUEp',
                            orgUnit: 'DiszpKrYNg8',
                            attributes: [
                                {
                                    attribute: 'cejWyOfXge6',
                                    displayName: 'Gender',
                                    createdAt: '2016-08-03T23:47:14.509',
                                    updatedAt: '2016-08-03T23:47:14.509',
                                    valueType: 'TEXT',
                                    value: 'Female',
                                },
                                {
                                    attribute: 'zDhUuAYrxNC',
                                    displayName: 'Last name',
                                    createdAt: '2016-08-03T23:47:14.517',
                                    updatedAt: '2016-08-03T23:47:14.517',
                                    valueType: 'TEXT',
                                    value: 'Jones',
                                },
                                {
                                    attribute: 'w75KJ2mc4zz',
                                    code: 'MMD_PER_NAM',
                                    displayName: 'First name',
                                    createdAt: '2016-08-03T23:47:14.516',
                                    updatedAt: '2016-08-03T23:47:14.516',
                                    valueType: 'TEXT',
                                    value: 'Anna',
                                },
                            ],
                        },
                    },
                    to: {
                        trackedEntity: {
                            trackedEntity: 'G1NNqS1RDeO',
                            trackedEntityType: 'nEenWmSyUEp',
                            orgUnit: 'DiszpKrYNg8',
                            attributes: [
                                {
                                    attribute: 'w75KJ2mc4zz',
                                    code: 'MMD_PER_NAM',
                                    displayName: 'First name',
                                    createdAt: '2024-02-01T11:50:25.479',
                                    updatedAt: '2024-02-01T11:50:25.479',
                                    valueType: 'TEXT',
                                    value: 'John',
                                },
                                {
                                    attribute: 'lZGmxYbs97q',
                                    code: 'MMD_PER_ID',
                                    displayName: 'Unique ID',
                                    createdAt: '2024-02-01T11:50:25.476',
                                    updatedAt: '2024-02-01T11:50:25.476',
                                    valueType: 'TEXT',
                                    value: '0078200',
                                },
                                {
                                    attribute: 'zDhUuAYrxNC',
                                    displayName: 'Last name',
                                    createdAt: '2024-02-01T11:50:25.479',
                                    updatedAt: '2024-02-01T11:50:25.479',
                                    valueType: 'TEXT',
                                    value: 'Mayer',
                                },
                            ],
                        },
                    },
                },
            ],
        },
    }).as('getRelationships');
});

Given('the user can see the relationship widget', () => {
    cy.get('[data-test="tracked-entity-relationship-widget"]')
        .should('be.visible');
});

When('there is an existing relationship', () => {
    cy.wait('@getRelationships');
    cy.get('[data-test="tracked-entity-relationship-widget"]')
        .within(() => {
            cy.get('[data-test="relationship-table-row"]')
                .contains('John');
        });
});

When('the user clicks the delete button', () => {
    cy.get('[data-test="tracked-entity-relationship-widget"]')
        .within(() => {
            cy.get('[data-test="relationship-table-row"]')
                .contains('John')
                .parent()
                .within(() => {
                    cy.get('[data-test="delete-relationship-button"]')
                        .click();
                });
        });
});

When('the user can see the delete relationship modal', () => {
    cy.get('[data-test="delete-relationship-modal"]').should('be.visible');
});

When('the user clicks the confirm delete button', () => {
    cy.intercept({
        method: 'POST',
        url: '**/tracker?importStrategy=DELETE&async=false**',
    }).as('deleteRelationship');

    cy.get('[data-test="delete-relationship-modal"]')
        .within(() => {
            cy.get('[data-test="delete-relationship-confirmation-button"]')
                .click();
        });

    cy.wait('@deleteRelationship')
        .its('request.body')
        .should('deep.equal', {
            relationships: [{ relationship: 'mwswG3RMNuu' }],
        });
});

Then('the user can see the relationship widget without the deleted relationship', () => {
    cy.get('[data-test="tracked-entity-relationship-widget"]')
        .within(() => {
            cy.get('[data-test="relationship-table-body"]')
                .should('not.exist');
        });
});
