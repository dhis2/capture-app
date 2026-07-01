import { Then, Given, When, After } from '@badeball/cypress-cucumber-preprocessor';

After({ tags: '@with-tracked-entity-status-cleanup' }, () => {
    cy.buildApiUrl(
        'tracker',
        'trackedEntities/EaOyKGOIGRp?fields=trackedEntity,trackedEntityType,orgUnit,inactive',
    )
        .then(url => cy.request(url))
        .then(({ body }) => {
            if (!body.inactive) {
                return undefined;
            }
            const trackedEntity = {
                trackedEntity: body.trackedEntity,
                trackedEntityType: body.trackedEntityType,
                orgUnit: body.orgUnit,
                inactive: false,
            };
            return cy
                .buildApiUrl('tracker?async=false&importStrategy=UPDATE')
                .then(updateUrl => cy.request('POST', updateUrl, { trackedEntities: [trackedEntity] }));
        });
});

Then('the profile details should be displayed', () => {
    cy.get('[data-test="profile-widget"]')
        .within(() => {
            cy.get('[data-test="widget-contents"]', { timeout: 1000 }).should('be.visible');
            cy.get('[data-test="profile-widget-flatlist"]').should('be.visible');
            cy.contains('First name').should('exist');
            cy.contains('Anna').should('exist');
            cy.contains('Last name').should('exist');
            cy.contains('Jones').should('exist');
        });
});

Then('the widget profile should be closed', () => {
    cy.get('[data-test="profile-widget"]')
        .within(() => {
            cy.get('[data-test="widget-contents"]')
                .should('not.exist');
        });
});

Then(/^the user sees the edit profile modal/, () =>
    cy.get('[data-test="modal-edit-profile"]').within(() => {
        cy.contains('Edit Person').should('exist');
        cy.contains(
            'Change information about this Person here. Information about this enrollment can be edited in the Enrollment widget.',
        ).should('exist');
        cy.contains('Save changes').should('exist');
        cy.contains('Cancel without saving').should('exist');
    }),
);

Given('you add a new tracked entity in the Malaria focus investigation program', () => {
    cy.visit('/#/new?programId=M3xtLkYBlKI&orgUnitId=DiszpKrYNg8');
    cy.get('input[type="text"]')
        .eq(2)
        .type(`Local id-${Math.round((new Date()).getTime() / 1000)}`)
        .blur();
    cy.contains('Save focus area')
        .click();
    cy.url().should('include', 'enrollmentEventEdit?');
});

When('you open the overflow menu and click the "Delete Focus area" button', () => {
    cy.get('[data-test=profile-widget]').contains('Focus area profile');

    cy.get('[data-test="tracked-entity-profile-overflow-button"]')
        .click();
    cy.contains('Delete Focus area')
        .click();
});

Then('you see the delete tracked entity confirmation modal', () => {
    cy.get('[data-test="widget-profile-delete-modal"]').within(() => {
        cy.contains(
            'Are you sure you want to delete this Focus area? This will permanently remove the Focus area and all its associated enrollments and events in all programs.',
        ).should('exist');
    });
});

When('you confirm by clicking the "Yes, delete Focus area" button', () => {
    cy.get('[data-test="widget-profile-delete-modal"]').within(() => {
        cy.contains('Yes, delete Focus area')
            .click();
    });
});

Then('you are redirected to the home page', () => {
    cy.url().should('include', 'selectedTemplateId=M3xtLkYBlKI');
});

Then('the user sees the tracked entity type polygon geometry', () => {
    cy.get('[data-test="modal-edit-profile"]').within(() => {
        cy.contains('Area on map saved').should('exist');
        cy.contains('Edit area on map').should('exist');
    });
});

When('you open the tracked entity profile overflow menu', () => {
    cy.get('[data-test="profile-widget"]').contains('Person profile').should('exist');
    cy.get('[data-test="tracked-entity-profile-overflow-button"]').click();
});

Then(/^you see the "(.*)" status toggle option$/, (label) => {
    cy.get('[data-test="tracked-entity-deactivate-menu-item"]').should('contain', label);
});

When('you click the status toggle menu item', () => {
    cy.get('[data-test="tracked-entity-deactivate-menu-item"]').click();
});

Then('you see the deactivate confirmation modal for the Person', () => {
    cy.get('[data-test="widget-profile-deactivate-modal"]').within(() => {
        cy.contains('Deactivate Person').should('exist');
        cy.contains(
            'Are you sure you want to deactivate this Person? This will change its status to inactive and only read operations will be allowed.',
        ).should('exist');
        cy.contains('Yes, deactivate Person').should('exist');
    });
});

Then('you see the activate confirmation modal for the Person', () => {
    cy.get('[data-test="widget-profile-deactivate-modal"]').within(() => {
        cy.contains('Activate Person').should('exist');
        cy.contains(
            'Are you sure you want to activate this Person? This will change its status to active and write operations will be allowed.',
        ).should('exist');
        cy.contains('Yes, activate Person').should('exist');
    });
});

When('you confirm the status toggle action', () => {
    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false*',
    }).as('toggleTrackedEntityStatus');
    cy.get('[data-test="widget-profile-deactivate-modal"]').within(() => {
        cy.get('[data-test="dhis2-uicore-button"]').last().click();
    });
    cy.wait('@toggleTrackedEntityStatus').its('response.statusCode').should('eq', 200);
});

When('you cancel the status toggle modal', () => {
    cy.get('[data-test="widget-profile-deactivate-modal"]').within(() => {
        cy.contains('No, cancel').click();
    });
});

Then('the status toggle modal is closed', () => {
    cy.get('[data-test="widget-profile-deactivate-modal"]').should('not.exist');
});

Then('the tracked entity profile is read-only', () => {
    cy.get('[data-test="profile-widget"]').within(() => {
        cy.contains('View profile').should('exist');
    });
    cy.contains('View only - You only have view access to this enrollment').should('exist');
});

Then('the tracked entity profile is editable', () => {
    cy.get('[data-test="profile-widget"]').within(() => {
        cy.contains('Edit').should('exist');
    });
});
