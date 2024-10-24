import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import '../../sharedSteps';

Given('you open the main page with Ngelehun and malaria case context', () => {
    cy.visit('#/?programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

Then('the bulk complete modal should open', () => {
    cy.get('[data-test="bulk-complete-events-dialog"]')
        .should('exist');
});

When('you click the confirm complete events button', () => {
    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false**',
    }, {
        statusCode: 200,
        body: {},
    }).as('completeEvents');

    cy.get('[data-test="bulk-complete-events-dialog"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Complete').click();

    cy.wait('@completeEvents')
        .its('request.body')
        .should(({ events }) => {
            expect(events).to.have.length(3);
            expect(events[0]).to.include({ status: 'COMPLETED' });
            expect(events[1]).to.include({ status: 'COMPLETED' });
            expect(events[2]).to.include({ status: 'COMPLETED' });
        });
});

Then('the bulk complete modal should close', () => {
    cy.get('[data-test="bulk-complete-events-dialog"]')
        .should('not.exist');
});

Then('the bulk delete modal should open', () => {
    cy.get('[data-test="bulk-delete-events-dialog"]')
        .should('exist');
});

// you click the confirm delete events button
When('you click the confirm delete events button', () => {
    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false**',
    }, {
        statusCode: 200,
        body: {},
    }).as('deleteEvents');

    cy.get('[data-test="bulk-delete-events-dialog"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Delete').click();

    cy.wait('@deleteEvents')
        .its('request.body')
        .should(({ events }) => {
            expect(events).to.have.length(3);
            expect(events).to.deep.include({ event: 'a969f7a3bf1' });
            expect(events).to.deep.include({ event: 'a6f092d0d44' });
            expect(events).to.deep.include({ event: 'a5e67163090' });
        });
});

Then('the bulk delete modal should close', () => {
    cy.get('[data-test="bulk-delete-events-dialog"]')
        .should('not.exist');
});
