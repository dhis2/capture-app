import '../sharedSteps';

beforeEach(() => {
    cy.loginThroughForm();
});

When('you add data to the form', () => {
    cy.get('[data-test="dataentry-field-eventDate"]')
        .find('input')
        .type('2020-01-01')
        .blur();
    cy.get('[data-test="form-field-qrur9Dvnyt5"]')
        .find('input')
        .type('25');
    cy.get('[data-test="form-field-oZg33kd9taw"]')
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
            cy.buildApiUrl('events', id)
                .then((eventUrl) => {
                    cy.request('DELETE', eventUrl);
                });
        });
});


When('you fill in the registration details', () => {
    cy.get('[data-test="relationship-register-tei-program-selector"]')
        .find('input')
        .type('Child{enter}', { force: true });
    cy.get('[data-test="form-field-w75KJ2mc4zz"]')
        .find('input')
        .type('Sarah');
    cy.get('[data-test="form-field-zDhUuAYrxNC"]')
        .find('input')
        .type('Gonz');
    cy.get('[data-test="form-field-cejWyOfXge6"]')
        .find('input')
        .type('Female{enter}', { force: true });
    cy.get('[data-test="dataentry-field-incidentDate"]')
        .find('input')
        .type('2020-01-01')
        .blur();
});

When('you submit the registration form', () => {
    cy.get('[data-test="create-and-link-button"]')
        .click();
    cy.get('[data-test="create-as-new-person"]')
        .click();
});

When('you submit the event form with the associated relationship to the newly created person', () => {
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
        cy.buildApiUrl('relationships', id)
            .then((relationshipUrl) => {
                cy.request('DELETE', relationshipUrl);
            });
    });
    cy.get('@postTrackedEntityInstance').then((result) => {
        const id = result.response.body.response.importSummaries[0].reference;
        cy.buildApiUrl('trackedEntityInstances', id)
            .then((trackedEntityInstanceUrl) => {
                cy.request('DELETE', trackedEntityInstanceUrl);
            });
    });
    cy.get('@postEvent').then((result) => {
        const id = result.response.body.response.importSummaries[0].reference;
        cy.buildApiUrl('events', id)
            .then((eventUrl) => {
                cy.request('DELETE', eventUrl);
            });
    });
});

When('you search for an existing unique id and link to the person', () => {
    cy.get('[data-test="form-field-lZGmxYbs97q"]')
        .find('input')
        .type('9191132445122')
        .blur(); // TODO: Look into why the click below is failing if the field is not blurred first

    cy.get('[data-test="relationship-tei-search-button-relationshipTeiSearch-nEenWmSyUEp-0"]')
        .click();

    cy.get('[data-test="relationship-tei-link-vu9dsAuJ29q"]')
        .click();
});


When('you submit the event form with the associated relationship to the already existing person', () => {
    cy.server();
    cy.route('POST', '**/events').as('postEvent');
    cy.route('POST', '**/relationships').as('postRelationship');
    cy.get('[data-test="dhis2-uicore-splitbutton-button"]')
        .click();
});


Then('the event and relationship should be sent to the server successfully', () => {
    cy.wait('@postEvent', { timeout: 20000 }).should('have.property', 'status', 200);
    cy.wait('@postRelationship', { timeout: 20000 }).should('have.property', 'status', 200);

    // clean up
    cy.get('@postRelationship').then((result) => {
        const id = result.response.body.response.importSummaries[0].reference;
        cy.buildApiUrl('relationships', id)
            .then((relationshipUrl) => {
                cy.request('DELETE', relationshipUrl);
            });
    });
    cy.get('@postEvent').then((result) => {
        const id = result.response.body.response.importSummaries[0].reference;
        cy.buildApiUrl('events', id)
            .then((eventUrl) => {
                cy.request('DELETE', eventUrl);
            });
    });
});

When('you select search scope TB program', () => {
    cy.get('[data-test="virtualized-select"]')
        .click()
        .contains('TB prog')
        .click();
});

And('you expand the attributes search area', () => {
    cy.get('[data-test="collapsible-button"]')
        .eq(4)
        .click();
});
