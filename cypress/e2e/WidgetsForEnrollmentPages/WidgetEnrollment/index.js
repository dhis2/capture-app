import { When, Then, After, Given } from '@badeball/cypress-cucumber-preprocessor';
import { getCurrentYear } from '../../../support/date';
import { hasVersionSupport } from '../../../support/tagUtils';

After({ tags: '@with-transfer-ownership-data-cleanup' }, () => {
    const teiQueryKey = hasVersionSupport('@v>=41') ? 'trackedEntity' : 'trackedEntityInstance';
    cy.buildApiUrl('tracker', `ownership/transfer?program=IpHINAT79UW&ou=DiszpKrYNg8&${teiQueryKey}=EaOyKGOIGRp`)
        .then(url => cy.request('PUT', url));
});

const changeEnrollmentAndEventsStatus = () => (
    cy.buildApiUrl('tracker', 'trackedEntities/osF4RF4EiqP?program=IpHINAT79UW&fields=enrollments')
        .then(url => cy.request(url))
        .then(({ body }) => {
            const enrollment = body.enrollments && body.enrollments.find(e => e.enrollment === 'qyx7tscVpVB');
            const eventsToUpdate = enrollment.events.map(e => ({ ...e, status: 'ACTIVE' }));
            const enrollmentToUpdate = { ...enrollment, status: 'ACTIVE', events: eventsToUpdate };

            return cy
                .buildApiUrl('tracker?async=false&importStrategy=UPDATE')
                .then(enrollmentUrl => cy.request('POST', enrollmentUrl, { enrollments: [enrollmentToUpdate] }))
                .then(() => {
                    cy.reload();
                    cy.get('[data-test="widget-enrollment"]').within(() => {
                        cy.get('[data-test="widget-enrollment-status"]').contains('Active').should('exist');
                    });
                });
        })
);

When('you click the enrollment widget toggle open close button', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-open-close-toggle-button"]').click();
    });
});

Then('the enrollment widget should be closed', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-contents"]').should('not.exist');
    });
});

Then('the enrollment widget should be opened', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-contents"]').children().should('exist');
    });
});

Then('the user sees the enrollment date', () => {
    cy.get('[data-test="widget-enrollment-enrollment-date"]').within(() => {
        cy.get('[data-test="widget-enrollment-icon-calendar"]').should('exist');
        cy.get('[data-test="widget-enrollment-date"]')
            .contains(`Date of enrollment: ${getCurrentYear()}-08-01`)
            .should('exist');
    });
});

Then('the user sees the incident date', () => {
    cy.get('[data-test="widget-enrollment-incident-date"]').within(() => {
        cy.get('[data-test="widget-enrollment-date"]')
            .contains(`Date of birth: ${getCurrentYear()}-08-01`)
            .should('exist');
    });
});
Then('the user sees the enrollment organisation unit', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-icon-orgunit"]').should('exist');
        cy.get('[data-test="widget-enrollment-orgunit"]')
            .contains('Started at: Ngelehun CHC')
            .should('exist');
    });
});

Then('the user sees the owner organisation unit', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-icon-owner-orgunit"]').should(
            'exist',
        );
        cy.get('[data-test="widget-enrollment-owner-orgunit"]')
            .contains('Owned by: Ngelehun CHC')
            .should('exist');
    });
});

Then('the user sees the last update date', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-icon-clock"]').should('exist');
        cy.get('[data-test="widget-enrollment-last-update"]')
            .contains('Last updated')
            .should('exist');
    });
});

When('the user opens the enrollment actions menu', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-actions-button"]').click();
    });
    cy.intercept({
        method: 'PUT',
        url: '**/enrollments/wBU0RAsYjKE',
    }).as('putEnrollment');
});

When(/^the user changes the enrollment status to (.*)$/, (status) => {
    cy.get(`[data-test="widget-enrollment-actions-${status}"]`).click();
    cy.wait('@putEnrollment');
});

Then(/^the user sees the enrollment status is (.*)$/, status =>
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-status"]')
            .contains(status)
            .should('exist');
    }),
);

When(/^the user (.*) the enrollment for followup/, (action) => {
    cy.get(
        `[data-test="widget-enrollment-actions-followup-${action}"]`,
    ).click();
    cy.wait('@putEnrollment');
});

Then(/^the user can see the enrollment is ?(.*) marked for follow up/, not =>
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-status"]')
            .contains('Follow-up')
            .should(not ? 'not.exist' : 'exist');
    }),
);

When(/^the user clicks on the delete action/, () =>
    cy.get('[data-test="widget-enrollment-actions-delete"]').click(),
);

When(/^the user clicks on the transfer action/, () => {
    cy.get('[data-test="widget-enrollment-actions-transfer"]').click();
});

Then(/^the user sees the delete enrollment modal/, () =>
    cy.get('[data-test="widget-enrollment-actions-modal"]').within(() => {
        cy.contains('Delete enrollment').should('exist');
        cy.contains(
            'Are you sure you want to delete this enrollment? This will permanently remove the current enrollment.',
        ).should('exist');
        cy.contains('No, cancel').should('exist');
        cy.contains('Yes, delete enrollment').should('exist');
    }),
);

Then('the user sees the enrollment status and the Baby Postnatal event status is active', () => {
    changeEnrollmentAndEventsStatus();
});

Then('the user sees the enrollment status and the Baby Postnatal event status is completed', () => {
    cy.url().should('include', `${Cypress.config().baseUrl}/#/enrollment?`);
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-status"]').contains('Completed').should('exist');
    });

    cy.get('[data-test="stage-content"]')
        .eq(1)
        .within(() => {
            cy.get('[data-test="dhis2-uicore-tag-text"]').contains('Completed').should('exist');
        });
    changeEnrollmentAndEventsStatus();
});

When('the user completes the enrollment and the active events', () => {
    cy.get('[data-test="widget-enrollment-actions-complete"]').click();

    cy.get('[data-test="widget-enrollment-complete-modal"]').within(() => {
        cy.contains('Would you like to complete the enrollment and all active events as well?').should('exist');
        cy.contains('The following events will be completed:').should('exist');
        cy.contains('1 event in Baby Postnatal').should('exist');
        cy.contains('No, cancel').should('exist');
        cy.contains('Complete enrollment only').should('exist');
        cy.contains('Yes, complete enrollment and events').should('exist');
    });
    cy.get('[data-test="widget-enrollment-actions-complete-button"]').click();
});

Then(/^the user sees the transfer modal/, () =>
    cy.get('[data-test="widget-enrollment-transfer-modal"]').within(() => {
        cy.contains('Transfer Ownership').should('exist');
        cy.contains(
            'Choose the organisation unit to which enrollment ownership should be transferred.',
        ).should('exist');
        cy.contains('Cancel').should('exist');
        cy.contains('Transfer').should('exist');
    }),
);

Then(/^the user sees the organisation unit tree/, () =>
    cy.get('[data-test="widget-enrollment-transfer-modal"]').within(() => {
        cy.get('[data-test="widget-enrollment-transfer-orgunit-tree"]').should(
            'exist',
        );
    }),
);

Then(/^the user clicks on the organisation unit with text: (.*)/, orgunit =>
    cy.get('[data-test="widget-enrollment-transfer-modal"]').within(() => {
        cy.get('[data-test="widget-enrollment-transfer-orgunit-tree"]').within(
            () => {
                cy.contains(orgunit).click();
            },
        );
    }),
);

Then(/^the user sees the organisation unit with text: (.*) is selected/, orgunit =>
    cy.get('[data-test="widget-enrollment-transfer-modal"]').within(() => {
        cy.get('[data-test="widget-enrollment-transfer-orgunit-tree"]').within(
            () => {
                cy.contains(orgunit).should('have.class', 'checked');
            },
        );
    }),
);

Then(/^the user successfully transfers the enrollment/, () => {
    cy.intercept(
        { method: 'PUT', url: '**/tracker/ownership/transfer**' },
    ).as('transferOwnership');

    cy.get('[data-test="widget-enrollment-transfer-modal"]').within(() => {
        cy.get('[data-test="widget-enrollment-transfer-button"]').click();
    });

    cy.wait('@transferOwnership');

    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-owner-orgunit"]')
            .contains('Owned by: Njandama MCHP')
            .should('exist');
    });
});

Then(/^the user types in (.*)/, (orgunit) => {
    cy.get('[data-test="widget-enrollment-transfer-modal"]').within(() => {
        cy.get('[data-test="capture-ui-input"]').type(orgunit);
    });
});

Given(/^the enrollment owner organisation unit is (.*)/, (orgunit) => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-owner-orgunit"]')
            .contains(`Owned by: ${orgunit}`)
            .should('exist');
    });
});

When('you see the enrollment minimap', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('.leaflet-container').should('exist');
    });
});

