beforeEach(() => {
    cy.login();
});

Given('you open the main page with Ngelehun and malaria case context', () => {
    cy.visit('#/?programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

When('you select the working list called Events today', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Events today')
        .click();
});

When('you change the sharing settings', () => {
    // Making post requests using the old d2 library doesn't work for cypress tests atm
    // since the sharing dialog is posting using the d2 library, we will need to temporarily send the post request manually
    cy.buildApiUrl('sharing?type=eventFilter&id=DLROs7S1P6R')
        .then((sharingUrl) => {
            cy.request('POST', sharingUrl, {
                meta: {
                    allowPublicAccess: true,
                    allowExternalAccess: false,
                },
                object: {
                    id: 'CLBKvCKspBk',
                    name: 'Events today',
                    displayName: 'Events today',
                    publicAccess: '--------',
                    user: {
                        id: 'GOLswS44mh8',
                        name: 'Tom Wakiki',
                    },
                    userGroupAccesses: [],
                    userAccesses: [{
                        id: 'OYLGMiazHtW',
                        name: 'Kevin Boateng',
                        displayName: 'Kevin Boateng',
                        access: 'rw------',
                    }],
                    externalAccess: false,
                },
            }).then(() => {
                cy.get('[data-test="list-view-menu-button"]')
                    .click();

                cy.contains('Share view')
                    .click();

                cy.get('[placeholder="Enter names"]')
                    .type('Boateng');

                cy.contains('Kevin Boateng')
                    .parent()
                    .click();

                cy.contains('Close')
                    .click();
            });
        });
});

When('you update the working list', () => {
    cy.get('[data-test="online-list-table"]')
        .contains('Report date')
        .click();

    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Update view')
        .click();
});

Then('your newly defined sharing settings should still be present', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Share view')
        .click();

    cy.contains('Kevin Boateng')
        .should('exist')
        .parent()
        .parent()
        .find('button')
        .eq(1)
        .click();

    cy.contains('Close')
        .click();

    cy.get('[data-test="online-list-table"]')
        .contains('Status')
        .click();

    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Update view')
        .click();

    // Making post requests using the old d2 library doesn't work for cypress tests atm
    // since the sharing dialog is posting using the d2 library, we will need to temporarily send the post request manually
    cy.buildApiUrl('sharing?type=eventFilter&id=DLROs7S1P6R')
        .then((sharingUrl) => {
            cy.request('POST', sharingUrl, {
                meta: {
                    allowPublicAccess: true,
                    allowExternalAccess: false,
                },
                object: {
                    id: 'CLBKvCKspBk',
                    name: 'Events today',
                    displayName: 'Events today',
                    publicAccess: '--------',
                    user: {
                        id: 'GOLswS44mh8',
                        name: 'Tom Wakiki',
                    },
                    userGroupAccesses: [],
                    userAccesses: [],
                    externalAccess: false,
                },
            });
        });
});

Given('you open the main page with Ngelehun and Inpatient morbidity and mortality context', () => {
    cy.visit('#/?programId=eBAyeGv0exc&orgUnitId=DiszpKrYNg8');
});

When('you set the date of admission filter', () => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();

            cy.contains('Date of admission')
                .click();
        });

    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.get('input[type="text"]')
                .then(($elements) => {
                    cy.wrap($elements[0])
                        .type('2018-01-01');

                    cy.wrap($elements[1])
                        .type('2018-12-31');
                });

            cy.contains('Apply')
                .click();
        });
});

When('you save the view as dateFilterWorkingList', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Save current view')
        .click();

    cy.get('[data-test="view-name-content"]')
        .type('dateFilterWorkingList');

    cy.server();
    cy.route('POST', '**/eventFilters**').as('newEventFilter');

    cy.get('button')
        .contains('Save')
        .click();

    cy.wait('@newEventFilter', { timeout: 30000 }).as('newEventResult');
});

When('you refresh the page', () => {
    cy.reload();
});

When('you open the dateFilterWorkingList', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('dateFilterWorkingList')
        .click();
});

Then('the admission filter should be in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Date of admission: 2018-01...')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.get('input[type="text"]')
                .then(($elements) => {
                    cy.wrap($elements[0])
                        .should('have.attr', 'value', '2018-01-01');

                    cy.wrap($elements[1])
                        .should('have.attr', 'value', '2018-12-31');
                });
        });

    // clean up
    cy.get('@newEventResult')
        .then((result) => {
            expect(result.status).to.equal(201);
            const id = result.response.body.response.uid;
            cy.buildApiUrl('eventFilters', id)
                .then((eventFiltersUrl) => {
                    cy.request('DELETE', eventFiltersUrl);
                });
        });
});
