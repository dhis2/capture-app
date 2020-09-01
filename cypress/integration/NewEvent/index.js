
beforeEach(() => {
    cy.loginThroughForm();
});

Given('you open the the new event page in Ngelehun and malaria case context', () => {
    cy.visit('/#/newEvent/programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

When('you add data to the form', () => {
    cy.get('[data-test="dhis2-capture-dataentry-field-eventDate"]', { timeout: 30000 })
        .find('input')
        .type('2020-01-01')
        .blur();
    cy.get('[data-test="dhis2-capture-form-field-qrur9Dvnyt5"]')
        .find('input')
        .type('25');
    cy.get('[data-test="dhis2-capture-form-field-oZg33kd9taw"]')
        .find('input')
        .type('Male{enter}', { force: true });
});

When('you submit the form', () => {
    cy.server();
    cy.route('POST', '**/events').as('postEvent');
    cy.get('[data-test="dhis2-uicore-splitbutton-button"]')
        .click();
});

Then('the event should be sent to the server successfully', () => {
    cy.wait('@postEvent', { timeout: 30000 })
        .then((result) => {
            expect(result.status).to.equal(200);
            // clean up
            const id = result.response.body.response.importSummaries[0].reference;
            cy.buildUrl(Cypress.env('dhis2_base_url'), `api/events/${id}`)
                .then((eventUrl) => {
                    cy.request('DELETE', eventUrl);
                });
        });
});

When('navigate to register a person relationship', () => {
    cy.get('[data-test="dhis2-capture-add-relationship-button"]')
        .click();
    cy.get('[data-test="dhis2-capture-relationship-type-selector-button-mxZDvSZYxlw"]')
        .click();
    cy.get('[data-test="dhis2-capture-create-relationship-button"]')
        .click();
});

When('you fill in the registration details', () => {
    cy.get('[data-test="dhis2-capture-relationship-register-tei-program-selector"]')
        .find('input')
        .type('Child{enter}', { force: true });
    cy.get('[data-test="dhis2-capture-dataentry-field-enrollmentDate"]')
        .find('input')
        .type('2020-01-01')
        .blur();
    cy.get('[data-test="dhis2-capture-dataentry-field-incidentDate"]')
        .find('input')
        .type('2020-01-01')
        .blur();
    cy.get('[data-test="dhis2-capture-form-field-w75KJ2mc4zz"]')
        .find('input')
        .type('Marcus');
    cy.get('[data-test="dhis2-capture-form-field-zDhUuAYrxNC"]')
        .find('input')
        .type('Barnes');
    cy.get('[data-test="dhis2-capture-form-field-cejWyOfXge6"]')
        .find('input')
        .type('Male{enter}', { force: true });
});

When('you submit the registration form', () => {
    cy.get('[data-test="dhis2-capture-create-and-link-button"]')
        .click();
});

When('you submit the event form with the associated tei relationship', () => {
    cy.server();
    cy.route('POST', '**/events').as('postEvent');
    cy.route('POST', '**/trackedEntityInstances').as('postTrackedEntityInstance');
    cy.route('POST', '**/relationships').as('postRelationship');
    cy.get('[data-test="dhis2-uicore-splitbutton-button"]')
        .click();
});

Then('the data should be sent to the server successfully', () => {
    cy.wait('@postTrackedEntityInstance', { timeout: 30000 }).should('have.property', 'status', 200);
    cy.wait('@postEvent', { timeout: 20000 }).should('have.property', 'status', 200);
    cy.wait('@postRelationship', { timeout: 20000 }).should('have.property', 'status', 200);

    // clean up
    cy.get('@postRelationship').then((result) => {
        const id = result.response.body.response.importSummaries[0].reference;
        cy.buildUrl(Cypress.env('dhis2_base_url'), `api/relationships/${id}`)
            .then((relationshipUrl) => {
                cy.request('DELETE', relationshipUrl);
            });
    });
    cy.get('@postTrackedEntityInstance').then((result) => {
        const id = result.response.body.response.importSummaries[0].reference;
        cy.buildUrl(Cypress.env('dhis2_base_url'), `api/trackedEntityInstances/${id}`)
            .then((trackedEntityInstanceUrl) => {
                cy.request('DELETE', trackedEntityInstanceUrl);
            });
    });
    cy.get('@postEvent').then((result) => {
        const id = result.response.body.response.importSummaries[0].reference;
        cy.buildUrl(Cypress.env('dhis2_base_url'), `api/events/${id}`)
            .then((eventUrl) => {
                cy.request('DELETE', eventUrl);
            });
    });
});
