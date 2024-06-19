import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { v4 as uuid } from 'uuid';
import '../sharedSteps';

When('you add data to the form', () => {
    cy.get('[data-test="dataentry-field-occurredAt"]')
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
    cy.intercept('POST', '**/tracker?async=false').as('postData');
    cy.get('[data-test="dhis2-uicore-splitbutton-button"]')
        .click();
});

Then('the event should be sent to the server successfully', () => {
    cy.wait('@postData', { timeout: 30000 })
        .then((result) => {
            expect(result.response.statusCode).to.equal(200);
            // clean up
            const id = result.response.body.bundleReport.typeReportMap.EVENT.objectReports[0].uid;
            cy.buildApiUrl('tracker?async=false&importStrategy=DELETE')
                .then((eventUrl) => {
                    cy.request('POST', eventUrl, { events: [{ event: id }] });
                });
        });
});


When('you fill in the registration details', () => {
    cy.get('[data-test="relationship-register-tei-program-selector"]')
        .find('input')
        .type('Provider', { force: true });
    cy.contains('Provider Follow-up and Support Tool').click();
    cy.contains('[data-test="form-field"]', 'Provider ID')
        .find('input')
        .type(uuid());
    cy.contains('[data-test="form-field"]', 'First name')
        .find('input')
        .type('Elanor');
    cy.contains('[data-test="form-field"]', 'Last name')
        .find('input')
        .type('Kaleno');
    cy.get('[data-test="dataentry-field-occurredAt"]')
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
    cy.intercept('POST', '**/tracker?async=false', (req) => {
        if (req.body.events) {
            req.alias = 'postEventData';
        } else if (req.body.trackedEntities) {
            req.alias = 'postTrackedEntityData';
        } else {
            req.alias = 'postRelationshipData';
        }
    });

    cy.get('[data-test="dhis2-uicore-splitbutton-button"]')
        .click();
});

Then('the data should be sent to the server successfully', () => {
    // verifying and cleaning up
    cy.wait('@postEventData', { timeout: 20000 });
    cy.wait('@postTrackedEntityData', { timeout: 20000 });
    cy.wait('@postRelationshipData', { timeout: 20000 });

    cy.get('@postRelationshipData')
        .then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            const relationshipId = response.body.bundleReport.typeReportMap.RELATIONSHIP.objectReports[0].uid;
            cy.buildApiUrl('tracker?async=false&importStrategy=DELETE')
                .then((relationshipUrl) => {
                    cy.request('POST', relationshipUrl, { relationships: [{ relationship: relationshipId }] });
                });
        })
        .then(() => {
            cy.get('@postTrackedEntityData')
                .then(({ response }) => {
                    expect(response.statusCode).to.equal(200);
                    const trackedEntityId = response.body.bundleReport.typeReportMap.TRACKED_ENTITY.objectReports[0].uid;
                    cy.buildApiUrl('tracker?async=false&importStrategy=DELETE')
                        .then((trackedEntityUrl) => {
                            cy.request('POST', trackedEntityUrl, { trackedEntities: [{ trackedEntity: trackedEntityId }] });
                        });
                });

            cy.get('@postEventData')
                .then(({ response }) => {
                    expect(response.statusCode).to.equal(200);
                    const eventId = response.body.bundleReport.typeReportMap.EVENT.objectReports[0].uid;
                    cy.buildApiUrl('tracker?async=false&importStrategy=DELETE')
                        .then((eventUrl) => {
                            cy.request('POST', eventUrl, { events: [{ event: eventId }] });
                        });
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
    cy.intercept('POST', '**/tracker?async=false', (req) => {
        if (req.body.events) {
            req.alias = 'postEventData';
        } else {
            req.alias = 'postRelationshipData';
        }
    });
    cy.get('[data-test="dhis2-uicore-splitbutton-button"]')
        .click();
});


Then('the event and relationship should be sent to the server successfully', () => {
    // verifying and cleaning up
    cy.wait('@postEventData', { timeout: 20000 });
    cy.wait('@postRelationshipData', { timeout: 20000 });

    cy.get('@postRelationshipData')
        .then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            const relationshipId = response.body.bundleReport.typeReportMap.RELATIONSHIP.objectReports[0].uid;
            cy.buildApiUrl('tracker?async=false&importStrategy=DELETE')
                .then((relationshipUrl) => {
                    cy.request('POST', relationshipUrl, { relationships: [{ relationship: relationshipId }] });
                });
        })
        .then(() => {
            cy.get('@postEventData')
                .then(({ response }) => {
                    expect(response.statusCode).to.equal(200);
                    const eventId = response.body.bundleReport.typeReportMap.EVENT.objectReports[0].uid;
                    cy.buildApiUrl('tracker?async=false&importStrategy=DELETE')
                        .then((eventUrl) => {
                            cy.request('POST', eventUrl, { events: [{ event: eventId }] });
                        });
                });
        });
});

When('you click the cancel button', () => {
    cy.get('[data-test="cancel-button"]')
        .click();
});

Then('you should be navigated back to the event form', () => {
    cy.contains('New Malaria case registration');
});
