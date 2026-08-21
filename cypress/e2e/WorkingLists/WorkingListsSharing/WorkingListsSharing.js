import { After, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { loginUser } from '../../../support/tagUtils';
import '../sharedSteps';

const ORG_UNIT_ID = 'DiszpKrYNg8'; // Ngelehun CHC
const EVENT_PROGRAM_ID = 'VBqh0ynB2wv'; // Malaria case registration
// Malaria case registration is shared as public rw------, i.e. metadata only, so the restricted user
// the non-owner scenarios log in as sees no events there and its list renders no table. This program
// is public rwrw----, so that user can read its events.
const SHARED_EVENT_PROGRAM_ID = 'MoUd5BTQ3lY'; // XX MAL RDT - Case Registration
const TRACKER_PROGRAM_ID = 'WSGAb5XwJ3Y'; // WHO RMNCH Tracker
const ANTENATAL_STAGE_ID = 'edqlbukwRfQ'; // Second antenatal care visit, in WHO RMNCH Tracker
const VIEW_NAME = 'sharedWorkingListView';
const VIEW_AND_EDIT = 'rw------';
const NO_ACCESS = '--------';
const RESTRICTED_USER = 'trackerAutoTestRestricted';
const LIST_VIEW_MENU = '[data-test="dhis2-uicore-menulist"]';

// Each list type has its own update code path, and all three reset sharing on update (DHIS2-21871),
// so the scenarios differ only in which one they drive. `sharingType` is what /api/sharing expects
// (TEMPLATE_SHARING_TYPE), and `programAsObject` because eventFilters takes program as a plain uid
// while the other two require a reference object.
const LIST_TYPES = {
    event: {
        resource: 'eventFilters',
        sharingType: 'eventFilter',
        programId: EVENT_PROGRAM_ID,
        criteriaKey: 'eventQueryCriteria',
        programAsObject: false,
    },
    // Same resource and code path as `event`, on a program whose events the non-owner can read.
    eventShared: {
        resource: 'eventFilters',
        sharingType: 'eventFilter',
        programId: SHARED_EVENT_PROGRAM_ID,
        criteriaKey: 'eventQueryCriteria',
        programAsObject: false,
        requiresDataRead: true,
    },
    tracker: {
        resource: 'trackedEntityInstanceFilters',
        sharingType: 'trackedEntityInstanceFilter',
        programId: TRACKER_PROGRAM_ID,
        criteriaKey: 'entityQueryCriteria',
        programAsObject: true,
    },
    // programStageWorkingLists is the only resource that also requires a program stage on create.
    programStage: {
        resource: 'programStageWorkingLists',
        sharingType: 'programStageWorkingList',
        programId: TRACKER_PROGRAM_ID,
        programStageId: ANTENATAL_STAGE_ID,
        criteriaKey: 'programStageQueryCriteria',
        programAsObject: true,
    },
};

// The list type each scenario drives is named in the step text, so no state has to be carried between
// steps. The non-owner scenarios use a different event program, hence the second map.
const OWNER_LIST_TYPES = {
    event: 'event',
    tracker: 'tracker',
    'program stage': 'programStage',
};

const NON_OWNER_LIST_TYPES = {
    event: 'eventShared',
    tracker: 'tracker',
    'program stage': 'programStage',
};

const resourceFor = listName => LIST_TYPES[OWNER_LIST_TYPES[listName]].resource;

const otherUsername = () => Cypress.env(`dhis2Username_${RESTRICTED_USER}`);

// The scenarios tagged @user:trackerAutoTestRestricted are logged in as that user, so the views they
// act on have to be created by somebody else. Switching session is how that is done, and it goes
// through the harness helper rather than a local copy of it: a cy.session id has to be declared with
// the same setup and validate every time, so redefining `user<name>` here would fail with "this
// session already exists". Going through loginUser keeps one definition per user for the whole suite,
// and means no request needs credentials of its own.
const switchToOwner = () => loginUser();

const switchToRestrictedUser = () => loginUser(RESTRICTED_USER);

// Views are looked up by name rather than remembered between steps, the same way
// cleanUpWorkingListIfApplicable does in the tracker working list steps.
const findViewByName = resource =>
    cy.buildApiUrl(`${resource}?filter=name:eq:${VIEW_NAME}&fields=id`)
        .then(url => cy.request(url))
        .then(({ body }) => body[resource][0]);

const deleteSharedViews = () => {
    Object.values(OWNER_LIST_TYPES).forEach((listType) => {
        const { resource } = LIST_TYPES[listType];

        cy.buildApiUrl(`${resource}?filter=name:eq:${VIEW_NAME}&fields=id`)
            .then(url => cy.request(url))
            .then(({ body }) => body[resource].forEach(({ id }) => {
                cy.buildApiUrl(resource, id)
                    .then(url => cy.request('DELETE', url));
            }));
    });
};

// Teardown by API rather than through the UI: a failing assertion must not leave the view behind for
// the next run to trip over. The owner session is restored first, so this runs as the user who owns
// the views no matter which user the scenario ended as.
After({ tags: '@working-list-sharing' }, () => {
    switchToOwner();
    deleteSharedViews();
});

// A failure here is the instance or the account being wrong for the scenario, not the behaviour under
// test. Without it, missing access surfaces as an opaque "table header never appeared" timeout. The
// message names the account and the program, which is what makes it worth asserting at all. Metadata
// read is required for every list type; the event list additionally needs data read, because its
// table only renders once events resolve, while the tracker list builds its columns from the template.
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

const lookUpOtherUser = () =>
    cy.buildApiUrl(`users?query=${otherUsername()}&fields=id,displayName,username`)
        .then(url => cy.request(url))
        .then(({ body }) => {
            const usernames = body.users.map(user => user.username);
            expect(usernames, 'usernames returned by the lookup').to.include(otherUsername());
            return body.users.find(user => user.username === otherUsername());
        });

const visitWorkingList = (listType) => {
    const { programId, resource } = LIST_TYPES[listType];
    // The tracker list needs the default template spelled out in the url, the same way the existing
    // tracker steps do; without it the list does not render.
    const templateParam = resource === 'eventFilters' ? '' : `&selectedTemplateId=${programId}-default`;

    cy.visit(`#/?programId=${programId}&orgUnitId=${ORG_UNIT_ID}${templateParam}`);
};

const openWorkingList = (listType) => {
    deleteSharedViews();
    visitWorkingList(listType);
};

const sortOnFirstColumn = () => {
    cy.get('[data-test="dhis2-uicore-tableheadercellaction"]')
        .eq(0)
        .click();
};

const openListViewMenu = () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();
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

When(/^you save the current (event|tracker|program stage) view$/, (listName) => {
    cy.intercept('POST', `**/${resourceFor(listName)}`).as('createView');

    // On an unmodified default view the save-as menu item is rendered without a click handler, so the
    // list has to differ from the default before it can be saved as a view.
    sortOnFirstColumn();

    clickListViewMenuItem('Save current view');

    cy.get('[data-test="view-name-content"]')
        .within(() => cy.get('input[type="text"]').type(VIEW_NAME).blur());

    cy.get('button').contains('Save').click();

    cy.wait('@createView');
});

// Sharing is granted through the real Share view dialog, so the dialog -> redux -> update payload
// wiring is covered, not just the payload shape.
When('you share the view with the other user', () => {
    clickListViewMenuItem('Share view');

    // The display name is resolved before the dialog scope opens, so the lookup request is not
    // enqueued inside it.
    lookUpOtherUser().then(({ displayName }) => {
        cy.get('[data-test="sharing-dialog"]').within(() => {
            cy.get('[placeholder="Search"]').type(otherUsername());
        });

        // The search results and the access-level menu render in poppers outside the dialog element,
        // so these two clicks are the only ones that cannot be scoped to it.
        cy.contains(displayName).click();

        cy.get('[data-test="sharing-dialog"]').within(() => {
            cy.contains('Choose a level').click();
        });

        cy.contains('View and edit').click({ force: true });

        cy.get('[data-test="sharing-dialog"]').within(() => {
            cy.get('[data-test="dhis2-uicore-button"]').contains('Give access').click({ force: true });
            cy.get('[data-test="dhis2-uicore-button"]').contains('Close').click({ force: true });
        });
    });
});

const seedSharedView = (listType) => {
    const { resource, sharingType, programId, programStageId, criteriaKey, programAsObject } = LIST_TYPES[listType];

    // Everything the logged-in user has to answer for is read first, before its session is swapped
    // for the owner's.
    cy.buildApiUrl('me?fields=id')
        .then(url => cy.request(url))
        .then(({ body: { id: myId } }) => {
            assertLoggedInUserCanUseProgram(listType);

            switchToOwner();
            deleteSharedViews();

            cy.buildApiUrl(resource)
                .then(url => cy.request({
                    method: 'POST',
                    url,
                    body: {
                        name: VIEW_NAME,
                        program: programAsObject ? { id: programId } : programId,
                        ...(programStageId && { programStage: { id: programStageId } }),
                        [criteriaKey]: { order: 'createdAt:desc' },
                    },
                }));

            findViewByName(resource).then(({ id: viewId }) => {
                cy.buildApiUrl(`sharing?type=${sharingType}&id=${viewId}`)
                    .then(url => cy.request({
                        method: 'POST',
                        url,
                        body: { object: { publicAccess: NO_ACCESS, userAccesses: [{ id: myId, access: VIEW_AND_EDIT }] } },
                    }));

                // Guards the premise of the scenario: DHIS2-13020 only reproduces for a non-owner, so
                // if the seeding ran as the logged-in user after all, fail here rather than pass
                // vacuously.
                cy.buildApiUrl(`${resource}/${viewId}?fields=sharing`)
                    .then(url => cy.request(url))
                    .its('body.sharing.owner')
                    .should((owner) => {
                        expect(owner, 'owner of the seeded view, which must not be the logged-in user')
                            .to.not.equal(myId);
                    });
            });

            switchToRestrictedUser();
        });
};

Given('an event working list view owned by another user is shared with you with view and edit access', () =>
    seedSharedView('eventShared'));

Given('a tracker working list view owned by another user is shared with you with view and edit access', () =>
    seedSharedView('tracker'));

Given('a program stage working list view owned by another user is shared with you with view and edit access', () =>
    seedSharedView('programStage'));

When(/^you open the shared (event|tracker|program stage) view$/, (listName) => {
    visitWorkingList(NON_OWNER_LIST_TYPES[listName]);

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

    // Close the menu again for the step that follows: while it is open its backdrop covers the menu
    // button, so the click that reopens it has to be forced.
    cy.get('[data-test="list-view-menu-button"]').click({ force: true });
});

When(/^you update the (event|tracker|program stage) view$/, (listName) => {
    cy.intercept('PUT', `**/${resourceFor(listName)}/*`).as('updateView');

    clickListViewMenuItem('Update view');

    cy.wait('@updateView');
});

// DHIS2-13020: the update used to fail with 409 for a user who is not the owner.
Then('the update is accepted by the server', () => {
    cy.get('@updateView')
        .its('response.statusCode')
        .should('equal', 200);
});

// DHIS2-21871: read the answer from the server, never from the sharing dialog — the dialog serves
// stale client state and reported the access as intact while the server had already dropped it.
// Both phrasings point at the same account: the user the view is shared with.
Then(/^the (event|tracker|program stage) view is still shared with (?:the other user|you)$/, (listName) => {
    const resource = resourceFor(listName);

    switchToOwner();

    lookUpOtherUser().then(({ id: userId }) => {
        findViewByName(resource).then(({ id: viewId }) => {
            cy.buildApiUrl(`${resource}/${viewId}?fields=sharing`)
                .then(url => cy.request(url))
                .its('body.sharing')
                .should((sharing) => {
                    expect(Object.keys(sharing.users), 'users the view is shared with').to.include(userId);
                    expect(sharing.users[userId].access, 'access level of the shared user').to.equal(VIEW_AND_EDIT);
                    expect(sharing.public, 'public access').to.equal(NO_ACCESS);
                });
        });
    });
});

// The Update view item only exists while the view differs from what is stored, so its absence is the
// signal that the update actually took effect.
Then('the view no longer has unsaved changes', () => {
    openListViewMenu();
    cy.get(LIST_VIEW_MENU).should('not.contain', 'Update view');
});
