import { After, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';

const ORG_UNIT_ID = 'DiszpKrYNg8'; // Ngelehun CHC
const EVENT_PROGRAM_ID = 'VBqh0ynB2wv'; // Malaria case registration
// Malaria case registration is shared as public rw------, i.e. metadata only, so the restricted user
// the non-owner scenarios log in as sees no events there and its list renders no table. This program
// is public rwrw----, so that user can read its events.
const SHARED_EVENT_PROGRAM_ID = 'MoUd5BTQ3lY'; // XX MAL RDT - Case Registration
const TRACKER_PROGRAM_ID = 'WSGAb5XwJ3Y'; // WHO RMNCH Tracker
const VIEW_NAME = 'sharedWorkingListView';
const VIEW_AND_EDIT = 'rw------';
const NO_ACCESS = '--------';

// Each list type has its own update code path, and all three reset sharing on update (DHIS2-21871).
// `sharingType` is what /api/sharing expects (TEMPLATE_SHARING_TYPE). `programFilter` differs
// because eventFilters filters on program and the others on program.id, and `programAsObject`
// because eventFilters takes program as a plain uid while the other two require a reference object.
const LIST_TYPES = {
    event: {
        resource: 'eventFilters',
        programFilter: 'program',
        sharingType: 'eventFilter',
        programId: EVENT_PROGRAM_ID,
        criteriaKey: 'eventQueryCriteria',
        programAsObject: false,
    },
    // Same resource and code path as `event`, on a program whose events the non-owner can read.
    eventShared: {
        resource: 'eventFilters',
        programFilter: 'program',
        sharingType: 'eventFilter',
        programId: SHARED_EVENT_PROGRAM_ID,
        criteriaKey: 'eventQueryCriteria',
        programAsObject: false,
        requiresDataRead: true,
    },
    tracker: {
        resource: 'trackedEntityInstanceFilters',
        programFilter: 'program.id',
        sharingType: 'trackedEntityInstanceFilter',
        programId: TRACKER_PROGRAM_ID,
        criteriaKey: 'entityQueryCriteria',
        programAsObject: true,
    },
    programStage: {
        resource: 'programStageWorkingLists',
        programFilter: 'program.id',
        sharingType: 'programStageWorkingList',
        programId: TRACKER_PROGRAM_ID,
        criteriaKey: 'programStageQueryCriteria',
        programAsObject: true,
    },
};

// The scenarios tagged @user:trackerAutoTestRestricted are logged in as that user, so the views they
// act on have to be created by somebody else — the default user, addressed with basic auth.
const ownerAuth = () => ({ user: Cypress.env('dhis2Username'), pass: Cypress.env('dhis2Password') });
const otherUsername = () => Cypress.env('dhis2Username_trackerAutoTestRestricted');
const otherPassword = () => Cypress.env('dhis2Password_trackerAutoTestRestricted');

// A request carrying basic auth comes back with a session cookie for that user, which replaces the
// cookie of the user the scenario is logged in as. Anything reading the session after an owner
// request would run as the owner, so the session has to be re-established.
// A failure here is the instance or the account being wrong for the scenario, not the behaviour under
// test. Without it, missing access surfaces as an opaque "table header never appeared" timeout — which
// is exactly how much time the first CI run cost. Metadata read is required for every list type; the
// event list additionally needs data read, because its table only renders once events resolve, while
// the tracker list builds its columns from the template.
const assertLoggedInUserCanUseProgram = (listType) => {
    const { programId, requiresDataRead } = LIST_TYPES[listType];

    cy.buildApiUrl(`programs/${programId}?fields=name,access`)
        .then(url => cy.request(url))
        .then(({ body: { name, access } }) => {
            expect(access.read, `${otherUsername()} can read the metadata of ${name}`).to.equal(true);
            if (requiresDataRead) {
                expect(access.data.read, `${otherUsername()} can read the events of ${name}`).to.equal(true);
            }
        });
};

const restoreSessionForLoggedInUser = () => {
    cy.loginByApi({
        username: otherUsername(),
        password: otherPassword(),
        baseUrl: Cypress.env('dhis2BaseUrl'),
    });
};

const deleteViewsNamed = (name) => {
    Object.values(LIST_TYPES).forEach(({ resource, programFilter, programId }) => {
        cy.buildApiUrl(`${resource}?filter=${programFilter}:eq:${programId}&fields=id,displayName`)
            .then(url => cy.request({ url, auth: ownerAuth() }))
            .then(({ body }) => {
                const leftovers = body[resource]?.filter(view => view.displayName === name) ?? [];
                leftovers.forEach(({ id }) => {
                    cy.buildApiUrl(resource, id)
                        .then(url => cy.request({ method: 'DELETE', url, auth: ownerAuth(), failOnStatusCode: false }));
                });
            });
    });
};

// Teardown by API rather than through the UI: a failing assertion must not leave the view behind for
// the next run to trip over.
After({ tags: '@working-list-sharing' }, () => {
    deleteViewsNamed(VIEW_NAME);
});

const lookUpOtherUser = () =>
    cy.buildApiUrl(`users?query=${otherUsername()}&fields=id,displayName,username`)
        .then(url => cy.request(url))
        .then(({ body }) => {
            // Avoids `.to.exist`, which reads as an unused expression to the Sonar gate.
            const usernames = body.users.map(user => user.username);
            expect(usernames, 'usernames returned by the lookup').to.include(otherUsername());
            return body.users.find(user => user.username === otherUsername());
        });

const visitWorkingList = (listType) => {
    const { programId } = LIST_TYPES[listType];
    // The tracker list needs the default template spelled out in the url, the same way the existing
    // tracker steps do; without it the list does not render.
    const templateParam = LIST_TYPES[listType].resource === 'eventFilters' ? '' : `&selectedTemplateId=${programId}-default`;
    cy.visit(`#/?programId=${programId}&orgUnitId=${ORG_UNIT_ID}${templateParam}`);
};

const openWorkingList = (listType) => {
    deleteViewsNamed(VIEW_NAME);
    visitWorkingList(listType);
    cy.wrap(listType).as('listType');
};

const sortOnFirstColumn = () => {
    cy.get('[data-test="dhis2-uicore-tableheadercellaction"]')
        .eq(0)
        .click();
};

const LIST_VIEW_MENU = '[data-test="dhis2-uicore-menulist"]';

// Clicking a menu item closes the menu, but while it is open its backdrop covers the menu button, so
// blindly clicking the button again fails. Open it only when it is not already open.
const openListViewMenu = () => {
    cy.get('body').then(($body) => {
        if ($body.find(LIST_VIEW_MENU).length === 0) {
            cy.get('[data-test="list-view-menu-button"]').click();
        }
    });
};

// The menu items are matched by label: ListViewMenu passes data-test to the @dhis2/ui MenuItem as an
// unknown prop, so no per-item hook reaches the DOM. Scoping to the open menu keeps the match tight.
const clickListViewMenuItem = (label) => {
    openListViewMenu();
    cy.get(LIST_VIEW_MENU).contains(label).click();
};

Given('you open the event working list', () => openWorkingList('event'));

Given('you open the tracker working list', () => openWorkingList('tracker'));

Given('you open the tracker working list filtered by the First antenatal care visit stage', () => {
    openWorkingList('programStage');

    cy.get('[data-test="tracker-working-lists"]')
        .within(() => cy.contains('More filters').click());

    cy.get('[data-test="more-filters-menu"]')
        .within(() => cy.contains('Program stage').click());

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('First antenatal care visit')
        .click();

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

When('you save the current view', () => {
    cy.get('@listType').then((listType) => {
        cy.intercept('POST', `**/${LIST_TYPES[listType].resource}`).as('createView');
    });

    // On an unmodified default view the save-as menu item is rendered without a click handler, so the
    // list has to differ from the default before it can be saved as a view.
    sortOnFirstColumn();

    clickListViewMenuItem('Save current view');

    cy.get('[data-test="view-name-content"]')
        .within(() => cy.get('input[type="text"]').type(VIEW_NAME).blur());

    cy.get('button').contains('Save').click();

    cy.wait('@createView')
        .its('response.body.response.uid')
        .as('viewId');
});

// Sharing is granted through the real Share view dialog, so the dialog -> redux -> update payload
// wiring is covered, not just the payload shape.
When('you share the view with the other user', () => {
    clickListViewMenuItem('Share view');

    cy.get('[placeholder="Search"]').type(otherUsername());
    lookUpOtherUser().then(({ displayName }) => cy.contains(displayName).click());

    cy.contains('Choose a level').click();
    cy.contains('View and edit').click({ force: true });
    cy.get('[data-test="dhis2-uicore-button"]').contains('Give access').click({ force: true });
    cy.get('[data-test="dhis2-uicore-button"]').contains('Close').click({ force: true });
});

const seedSharedView = (listType) => {
    const { resource, sharingType, programId, criteriaKey, programAsObject } = LIST_TYPES[listType];

    cy.wrap(listType).as('listType');

    // Both of these read the session, so they have to run before any request carrying basic auth,
    // which would otherwise replace the session cookie with the owner's.
    cy.buildApiUrl('me?fields=id')
        .then(url => cy.request(url))
        .then(({ body }) => cy.wrap(body.id).as('myId'));

    assertLoggedInUserCanUseProgram(listType);

    deleteViewsNamed(VIEW_NAME);

    cy.buildApiUrl(resource)
        .then(url => cy.request({
            method: 'POST',
            url,
            auth: ownerAuth(),
            body: {
                name: VIEW_NAME,
                program: programAsObject ? { id: programId } : programId,
                [criteriaKey]: { order: 'createdAt:desc' },
            },
        }))
        .then(({ body }) => cy.wrap(body.response.uid).as('viewId'));

    cy.get('@myId').then((myId) => {
        cy.get('@viewId').then((viewId) => {
            cy.buildApiUrl(`sharing?type=${sharingType}&id=${viewId}`)
                .then(url => cy.request({
                    method: 'POST',
                    url,
                    auth: ownerAuth(),
                    body: { object: { publicAccess: NO_ACCESS, userAccesses: [{ id: myId, access: VIEW_AND_EDIT }] } },
                }));

            // Guards the premise of the scenario: DHIS2-13020 only reproduces for a non-owner, so if
            // the seeding ran as the logged-in user after all, fail here rather than pass vacuously.
            cy.buildApiUrl(`${resource}/${viewId}?fields=sharing`)
                .then(url => cy.request({ url, auth: ownerAuth() }))
                .its('body.sharing.owner')
                .should((owner) => {
                    expect(owner, 'owner of the seeded view, which must not be the logged-in user')
                        .to.not.equal(myId);
                });

            restoreSessionForLoggedInUser();
        });
    });
};

Given('an event working list view owned by another user is shared with you with view and edit access', () =>
    seedSharedView('eventShared'));

Given('a tracker working list view owned by another user is shared with you with view and edit access', () =>
    seedSharedView('tracker'));

When('you open the shared view', () => {
    cy.get('@listType').then(listType => visitWorkingList(listType));

    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains(VIEW_NAME)
        .click();
});

When('you change the sorting', () => {
    sortOnFirstColumn();
});

// DHIS2-13020 was first reported as the Update view option not being shown at all to a user with
// view and edit access. The option is gated on access.write and access.update, and on the view
// having unsaved changes, so this is asserted after the sorting change rather than before it.
Then('you are offered the option to update the view', () => {
    openListViewMenu();
    cy.get(LIST_VIEW_MENU).should('contain', 'Update view');
});

When('you update the view', () => {
    cy.get('@listType').then((listType) => {
        cy.intercept('PUT', `**/${LIST_TYPES[listType].resource}/*`).as('updateView');
    });

    clickListViewMenuItem('Update view');

    cy.wait('@updateView').its('response.statusCode').as('updateStatus');
});

// DHIS2-13020: the update used to fail with 409 for a user who is not the owner.
Then('the update is accepted by the server', () => {
    cy.get('@updateStatus').should('equal', 200);
});

// DHIS2-21871: read the answer from the server, never from the sharing dialog — the dialog serves
// stale client state and reported the access as intact while the server had already dropped it.
const assertStillSharedWith = (userIdAlias) => {
    cy.get('@listType').then((listType) => {
        cy.get('@viewId').then((viewId) => {
            cy.get(userIdAlias).then((userId) => {
                cy.buildApiUrl(`${LIST_TYPES[listType].resource}/${viewId}?fields=sharing`)
                    .then(url => cy.request({ url, auth: ownerAuth() }))
                    .its('body.sharing')
                    .should((sharing) => {
                        expect(Object.keys(sharing.users), 'users the view is shared with').to.include(userId);
                        expect(sharing.users[userId].access, 'access level of the shared user').to.equal(VIEW_AND_EDIT);
                        expect(sharing.public, 'public access').to.equal(NO_ACCESS);
                    });
            });
        });
    });
};

Then('the view is still shared with the other user', () => {
    lookUpOtherUser().then(({ id }) => cy.wrap(id).as('otherUserId'));
    assertStillSharedWith('@otherUserId');
});

Then('the view is still shared with you', () => assertStillSharedWith('@myId'));

// The Update view item only exists while the view differs from what is stored, so its absence is the
// signal that the update actually took effect.
Then('the view no longer has unsaved changes', () => {
    openListViewMenu();
    cy.get(LIST_VIEW_MENU).should('not.contain', 'Update view');
});
