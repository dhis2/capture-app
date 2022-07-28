import '../../sharedSteps';
import '../../../sharedSteps';

beforeEach(() => {
    cy.loginThroughForm();
});

Given('you open the main page with Ngelehun and malaria case context', () => {
    cy.visit('#/?programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

Then('the default working list should be displayed', () => {
    const rows = [
        '14 Male',
        '67 Male',
        '66 Male',
        '55 Male',
        '26 Female',
        '35 Male',
        '12 Male',
        '49 Male',
        '60 Male',
        '61 Male',
        '27 Female',
        '20 Male',
        '69 Male',
        '11 Male',
        '59 Male',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

When('you select the working list called events assigned to anyone', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Events assigned to anyone')
        .click();
});

Then('the list should display events assigned to anyone', () => {
    const rows = [
        '14 Male Milla',
        '67 Male Milla',
        '25 Female Milla',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 4)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[2])
                    .should('exist');
            }
        });
});

Then('the list should display active events that are assigned to anyone', () => {
    const rows = [
        '14 Male Milla',
        '67 Male Milla',
        '25 Female Milla',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 4)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[2])
                    .should('exist');
            }
        });
});

When('you set the age filter to 10-20', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Age (years)')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Min"]')
        .type('10');

    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Max"]')
        .type('20');
});

Then('the age filter button should show that the filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Age (years): 10 to 20')
        .should('exist');
});

Then('the list should display events where age is between 10 and 20', () => {
    const rows = [
        '14 Male',
        '12 Male',
        '20 Male',
        '11 Male',
        '19 Male',
        '15 Female',
        '14 Male',
        '20 Female',
        '20 Male',
        '18 Male',
        '18 Female',
        '11 Female',
        '10 Male',
        '11 Female',
        '11 Male',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

When('you open the column selector', () => {
    cy.get('button[title="Select columns"]')
        .click();
});

When('you select Household location and save from the column selector', () => {
    cy.get('div[role="dialog"]')
        .contains('Household location')
        .find('input')
        .click();

    cy.get('div[role="dialog"]')
        .contains('Save')
        .click();
});

Then('Household location should display in the list', () => {
    cy.get('[data-test="online-list-table"]')
        .contains('Household location')
        .should('exist');
});

Then('the list should display data for the second page', () => {
    const rows = [
        '19 Male',
        '56 Female',
        '61 Male',
        '9 Male',
        '15 Female',
        '55 Female',
        '2 Male',
        '8 Female',
        '14 Male',
        '70 Male',
        '22 Male',
        '4 Male',
        '2 Male',
        '28 Female',
        '44 Male',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

Then('the list should display 10 rows of data', () => {
    const rows = [
        '14 Male',
        '67 Male',
        '66 Male',
        '55 Male',
        '26 Female',
        '35 Male',
        '12 Male',
        '49 Male',
        '60 Male',
        '61 Male',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 11)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

When('you click the report date column header', () => {
    cy.get('[data-test="online-list-table"]')
        .contains('Report date')
        .click();
});

Then('the list should display data ordered descendingly by report date', () => {
    const rows = [
        '14 Female',
        '63 Male',
        '4 Female',
        '37 Male',
        '68 Female',
        '27 Male',
        '45 Female',
        '9 Male',
        '62 Female',
        '59 Male',
        '50 Female',
        '66 Male',
        '42 Female',
        '51 Female',
        '1 Female',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

When('you select the working list called Events today', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Events today')
        .click();
});

When('you change the sharing settings', () => {
    // Making post requests using the old d2 library doesn't work for cypress tests atm
    // since the sharing dialog is posting using the d2 library, we will need to temporarily send the post request manually
    cy.buildApiUrl('sharing?type=eventFilter&id=CLBKvCKspBk')
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
    cy.buildApiUrl('sharing?type=eventFilter&id=CLBKvCKspBk')
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

When(/^you save the view as (.*)$/, (name) => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Save current view')
        .click();

    cy.get('[data-test="view-name-content"]')
        .type(name);

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

When('you delete the name toDeleteWorkingList', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();
    cy.contains('Delete view')
        .click();
    cy.server();
    cy.route('DELETE', '**/eventFilters/**').as('deleteEventFilters');
    cy.get('button')
        .contains('Confirm')
        .click();
    cy.wait('@deleteEventFilters', { timeout: 30000 });
});

Then('the custom events working list is deleted', () => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => {
            cy.contains('toDeleteWorkingList').should('not.exist');
        });
});