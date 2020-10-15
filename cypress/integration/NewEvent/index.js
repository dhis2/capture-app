
Given('you open the the new event page in Ngelehun and malaria case context', () => {
    cy.visit('/#/newEvent/programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

When('you add data to the form', () => {
    cy.get('[data-test="dhis2-capture-dataentry-field-eventDate"]')
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
            cy.buildApiUrl('events', id)
                .then((eventUrl) => {
                    cy.request('DELETE', eventUrl);
                });
        });
});

When('you navigate to register a person relationship', () => {
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

When('you navigate to find a person relationship', () => {
    cy.get('[data-test="dhis2-capture-add-relationship-button"]')
        .click();
    cy.get('[data-test="dhis2-capture-relationship-type-selector-button-mxZDvSZYxlw"]')
        .click();
    cy.get('[data-test="dhis2-capture-find-relationship-button"]')
        .click();
});

When('you search for an existing unique id and link to the person', () => {
    cy.get('[data-test="dhis2-capture-form-field-lZGmxYbs97q"]')
        .find('input')
        .type('9191132445122')
        .blur(); // TODO: Look into why the click below is failing if the field is not blurred first

    cy.get('[data-test="dhis2-capture-relationship-tei-search-button-relationshipTeiSearch-nEenWmSyUEp-0"]')
        .click();

    cy.get('[data-test="dhis2-capture-relationship-tei-link-vu9dsAuJ29q"]')
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
    cy.get('[data-test="dhis2-capture-virtualized-select"]')
        .click()
        .contains('TB prog')
        .click();
});

And('you expand the attributes search area', () => {
    cy.get('[data-test="dhis2-capture-collapsible-button"]')
        .eq(4)
        .click();
});


And('you click search', () => {
    cy.get('[data-test="dhis2-capture-d2-form-area"]')
        .find('button')
        .click();
});

Then('you can see the first page of the results', () => {
    cy.get('[data-test="dhis2-capture-card-list-item"]')
        .should('have.length.greaterThan', 0);
    cy.get('[data-test="dhis2-capture-pagination"]')
        .contains('Page 1')
        .should('exist');
});

