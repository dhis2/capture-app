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
