import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import '../../sharedSteps';

Given('you open the main page with Ngelehun and child programe context', () => {
    cy.visit('#/?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8');
});

Given('you open the main page with Ngelehun and Malaria Case diagnosis context', () => {
    cy.visit('#/?programId=qDkgAbB5Jlk&orgUnitId=DiszpKrYNg8');
});

Given('you open the main page with Ngelehun and WHO RMNCH Tracker context', () => {
    cy.visit('#/?programId=WSGAb5XwJ3Y&orgUnitId=DiszpKrYNg8');
});

// you open the working lists
Given('you open the working lists', () => {
    cy.get('[data-test="template-selector-create-list"]')
        .click();
});

Then('the bulk complete enrollments modal should open', () => {
    cy.get('[data-test="bulk-complete-enrollments-dialog"]')
        .should('exist');
});

When('it should say there are 2 active enrollments and 1 completed enrollment', () => {
    cy.get('[data-test="bulk-complete-enrollments-dialog"]')
        .contains('This action will complete 2 active enrollments in your selection.' +
            ' 1 enrollment already marked as completed will not be changed.');
});

Then('you confirm 3 active enrollments successfully', () => {
    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false&importStrategy=UPDATE&importMode=VALIDATE',
    }).as('completeEnrollmentsDryRun');

    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false&importStrategy=UPDATE&importMode=COMMIT',
    }, {
        statusCode: 200,
        body: {},
    }).as('completeEnrollments');

    cy.get('[data-test="bulk-complete-enrollments-dialog"]')
        .find('[data-test="bulk-complete-enrollments-confirm-button"]')
        .click();

    cy.wait('@completeEnrollmentsDryRun')
        .then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.request.body.enrollments).to.have.length(3);
        });

    cy.wait('@completeEnrollments')
        .its('request.body')
        .should(({ enrollments }) => {
            // Should be 3 enrollments
            expect(enrollments).to.have.length(3);

            // The enrollment with id 'xlLV3hNvsIb' should be completed with no events
            const enrollment = enrollments.find(e => e.enrollment === 'xlLV3hNvsIb');
            expect(enrollment).to.include({ enrollment: 'xlLV3hNvsIb', status: 'COMPLETED' });
            expect(enrollment.events).to.have.length(0);

            // The enrollment with id 'h4W0ax873Zq' should be completed with one completed event
            const enrollment2 = enrollments.find(e => e.enrollment === 'h4W0ax873Zq');
            expect(enrollment2).to.include({ enrollment: 'h4W0ax873Zq', status: 'COMPLETED' });
            expect(enrollment2.events).to.have.length(1);
            expect(enrollment2.events[0]).to.include({ event: 'WSBZ189OfQd', status: 'COMPLETED' });

            // The enrollment with id 'YBXMrojc2Wn' should be completed with one completed event
            const enrollment3 = enrollments.find(e => e.enrollment === 'vky6UDe2QEG');
            expect(enrollment3).to.include({ enrollment: 'vky6UDe2QEG', status: 'COMPLETED' });
            expect(enrollment3.events).to.have.length(1);
            expect(enrollment3.events[0]).to.include({ event: 'gIuo0V0CTj5', status: 'COMPLETED' });
        });
});

Then('the bulk complete enrollments modal should close', () => {
    cy.get('[data-test="bulk-complete-enrollments-dialog"]')
        .should('not.exist');
});

When(/^you select row number (.*)$/, (rowNumber) => {
    cy.get('[data-test="dhis2-uicore-tablebody"]')
        .find('tr')
        .eq(rowNumber)
        .find('[data-test="select-row-checkbox"]')
        .click();
});

Then(/^the modal content should say: (.*)$/, (content) => {
    cy.get('[data-test="bulk-complete-enrollments-dialog"]')
        .contains(content);
});

When('you deselect the complete events checkbox', () => {
    cy.get('[data-test="bulk-complete-enrollments-dialog"]')
        .find('[data-test="dhis2-uicore-checkbox"]')
        .click();
});

When('you confirm 1 active enrollment without completing events successfully', () => {
    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false&importStrategy=UPDATE&importMode=VALIDATE',
    }).as('completeEnrollmentsDryRun');

    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false&importStrategy=UPDATE&importMode=COMMIT',
    }, {
        statusCode: 200,
        body: {},
    }).as('completeEnrollments');

    cy.get('[data-test="bulk-complete-enrollments-dialog"]')
        .find('[data-test="bulk-complete-enrollments-confirm-button"]')
        .click();

    cy.wait('@completeEnrollmentsDryRun')
        .then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.request.body.enrollments).to.have.length(1);
        });

    cy.wait('@completeEnrollments')
        .its('request.body')
        .should(({ enrollments }) => {
            // Should be 1 enrollment
            expect(enrollments).to.have.length(1);

            // Assert that first enrollment is completed with one completed event
            expect(enrollments[0]).to.include({ enrollment: 'Rkx1QOZeBra', status: 'COMPLETED' });
            expect(enrollments[0].events).to.have.length(0);
        });
});

When('you confirm 2 active enrollments with errors', () => {
    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false&importStrategy=UPDATE&importMode=VALIDATE',
    }).as('completeEnrollmentsDryRun');

    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false&importStrategy=UPDATE&importMode=COMMIT',
    }, {
        statusCode: 200,
        body: {},
    }).as('completeEnrollments');

    cy.get('[data-test="bulk-complete-enrollments-dialog"]')
        .find('[data-test="bulk-complete-enrollments-confirm-button"]')
        .click();

    cy.wait('@completeEnrollmentsDryRun')
        .then((interception) => {
            expect(interception.response.statusCode).to.eq(409);
            expect(interception.request.body.enrollments).to.have.length(4);
        });

    cy.wait('@completeEnrollments')
        .its('request.body')
        .should(({ enrollments }) => {
            // The bad data should be filtered out and not sent to the server
            expect(enrollments).to.have.length(2);

            const enrollment1 = enrollments.find(e => e.enrollment === 'Rkx1QOZeBra');
            expect(enrollment1).to.include({ enrollment: 'Rkx1QOZeBra', status: 'COMPLETED' });
            expect(enrollment1.events).to.have.length(1);
            expect(enrollment1.events[0]).to.include({ event: 'TIU452W5bI1', status: 'COMPLETED' });

            const enrollment2 = enrollments.find(e => e.enrollment === 'JAfTBlr2Cj2');
            expect(enrollment2).to.include({ enrollment: 'JAfTBlr2Cj2', status: 'COMPLETED' });
            expect(enrollment2.events).to.have.length(1);
            expect(enrollment2.events[0]).to.include({ event: 'xiNGHVi6HVv', status: 'COMPLETED' });
        });
});

Then('an error dialog will be displayed to the user', () => {
    cy.get('[data-test="bulk-complete-enrollments-dialog"]')
        .contains('Error completing enrollments');

    cy.get('[data-test="bulk-complete-enrollments-dialog"]')
        .contains('Some enrollments were completed successfully, ' +
            'but there was an error while completing the rest. Please see the details below.');

    cy.get('[data-test="widget-open-close-toggle-button"]')
        .click();

    cy.get('[data-test="bulk-complete-enrollments-dialog"]')
        .find('li')
        .should('have.length', 5);

    cy.get('[data-test="bulk-complete-enrollments-dialog"]')
        .find('li')
        .contains('Mandatory DataElement `f9xYwUwrHq9` is not present');
});

When('you close the error dialog', () => {
    cy.get('[data-test="bulk-complete-enrollments-dialog"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Cancel');
});

Then('the unsuccessful enrollments should still be selected', () => {
    cy.get('[data-test="dhis2-uicore-tablebody"]')
        .find('tr')
        .eq(0)
        .should('have.class', 'selected');

    cy.get('[data-test="dhis2-uicore-tablebody"]')
        .find('tr')
        .eq(2)
        .should('have.class', 'selected');
});

Then('the bulk delete enrollments modal should open', () => {
    cy.get('[data-test="bulk-delete-enrollments-dialog"]')
        .should('exist');

    cy.contains('Delete selected enrollments');
});

When('you deselect completed enrollments', () => {
    cy.get('[data-test="bulk-delete-enrollments-dialog"]')
        .find('[data-test="bulk-delete-enrollments-completed-checkbox"]')
        .click();
});

When('you confirm deleting 2 active enrollments', () => {
    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false&importStrategy=DELETE',
    }, {
        statusCode: 200,
        body: {},
    }).as('deleteEnrollments');

    cy.get('[data-test="bulk-delete-enrollments-dialog"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Delete 2 enrollments')
        .click();

    cy.wait('@deleteEnrollments')
        .its('request.body')
        .should(({ enrollments }) => {
            expect(enrollments).to.have.length(2);
            expect(enrollments).to.deep.include({ enrollment: 'Rkx1QOZeBra' });
            expect(enrollments).to.deep.include({ enrollment: 'hDVHG1OavhE' });
        });
});

Then('the bulk delete enrollments modal should close', () => {
    cy.get('[data-test="bulk-delete-enrollments-dialog"]')
        .should('not.exist');
});

When('you confirm deleting 3 enrollments', () => {
    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false&importStrategy=DELETE',
    }, {
        statusCode: 200,
        body: {},
    }).as('deleteEnrollments');

    cy.get('[data-test="bulk-delete-enrollments-dialog"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Delete 3 enrollments')
        .click();

    cy.wait('@deleteEnrollments')
        .its('request.body')
        .should(({ enrollments }) => {
            expect(enrollments).to.have.length(3);
            expect(enrollments).to.deep.include({ enrollment: 'PvJFfKjNWbq' });
            expect(enrollments).to.deep.include({ enrollment: 'Rkx1QOZeBra' });
            expect(enrollments).to.deep.include({ enrollment: 'hDVHG1OavhE' });
        });
});

Then('the bulk delete enrollments button should not be visible', () => {
    cy.get('[data-test="bulk-action-bar"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Delete enrollments')
        .should('not.exist');
});
