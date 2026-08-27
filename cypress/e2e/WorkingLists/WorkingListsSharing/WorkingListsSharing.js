import { After, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';

const ORG_UNIT_ID = 'DiszpKrYNg8';
const EVENT_PROGRAM_ID = 'VBqh0ynB2wv';
const SHARED_EVENT_PROGRAM_ID = 'MoUd5BTQ3lY';
const TRACKER_PROGRAM_ID = 'WSGAb5XwJ3Y';
const ANTENATAL_STAGE_ID = 'edqlbukwRfQ';
const VIEW_NAME = 'sharedWorkingListView';
const VIEW_AND_EDIT = 'rw------';
const NO_ACCESS = '--------';
const RESTRICTED_USER = 'trackerAutoTestRestricted';
const LIST_VIEW_MENU = '[data-test="dhis2-uicore-menulist"]';

const LIST_TYPES = {
    event: {
        resource: 'eventFilters',
        sharingType: 'eventFilter',
        programId: EVENT_PROGRAM_ID,
        criteriaKey: 'eventQueryCriteria',
        programAsObject: false,
    },
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
    programStage: {
        resource: 'programStageWorkingLists',
        sharingType: 'programStageWorkingList',
        programId: TRACKER_PROGRAM_ID,
        programStageId: ANTENATAL_STAGE_ID,
        criteriaKey: 'programStageQueryCriteria',
        programAsObject: true,
    },
};

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

const asAdmin = () => ({
    username: Cypress.env('dhis2Username'),
    password: Cypress.env('dhis2Password'),
});

const findViewByName = resource =>
    cy.buildApiUrl(`${resource}?filter=name:eq:${VIEW_NAME}&fields=id`)
        .then(url => cy.request({ url, auth: asAdmin() }))
        .then(({ body }) => body[resource][0]);

const deleteSharedViews = () => {
    Object.values(OWNER_LIST_TYPES).forEach((listType) => {
        const { resource } = LIST_TYPES[listType];

        findViewByName(resource).then((view) => {
            if (!view) return;
            cy.buildApiUrl(resource, view.id)
                .then(url => cy.request({ url, method: 'DELETE', auth: asAdmin() }));
        });
    });
};

After({ tags: '@with-working-list-sharing-cleanup' }, () => {
    deleteSharedViews();
});

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
        .then(url => cy.request({ url, auth: asAdmin() }))
        .then(({ body }) => {
            const usernames = body.users.map(user => user.username);
            expect(usernames, 'usernames returned by the lookup').to.include(otherUsername());
            return body.users.find(user => user.username === otherUsername());
        });

const visitWorkingList = (listType) => {
    const { programId, resource } = LIST_TYPES[listType];
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

    sortOnFirstColumn();

    clickListViewMenuItem('Save current view');

    cy.get('[data-test="view-name-content"]')
        .within(() => cy.get('input[type="text"]').type(VIEW_NAME).blur());

    cy.get('button').contains('Save').click();

    cy.wait('@createView');
});

When('you share the view with the other user', () => {
    clickListViewMenuItem('Share view');

    lookUpOtherUser().then(({ displayName }) => {
        cy.get('[data-test="sharing-dialog"]').within(() => {
            cy.get('[placeholder="Search"]').type(otherUsername());
        });

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

    cy.buildApiUrl('me?fields=id')
        .then(url => cy.request(url))
        .then(({ body: { id: myId } }) => {
            assertLoggedInUserCanUseProgram(listType);

            deleteSharedViews();

            cy.buildApiUrl(resource)
                .then(url => cy.request({
                    method: 'POST',
                    url,
                    auth: asAdmin(),
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
                        auth: asAdmin(),
                        body: { object: { publicAccess: NO_ACCESS, userAccesses: [{ id: myId, access: VIEW_AND_EDIT }] } },
                    }));

                cy.buildApiUrl(`${resource}/${viewId}?fields=sharing`)
                    .then(url => cy.request({ url, auth: asAdmin() }))
                    .its('body.sharing.owner')
                    .should((owner) => {
                        expect(owner, 'owner of the seeded view, which must not be the logged-in user')
                            .to.not.equal(myId);
                    });
            });
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

Then('you are offered the option to update the view', () => {
    openListViewMenu();
    cy.get(LIST_VIEW_MENU).should('contain', 'Update view');

    cy.get('[data-test="list-view-menu-button"]').click({ force: true });
});

When(/^you update the (event|tracker|program stage) view$/, (listName) => {
    cy.intercept('PUT', `**/${resourceFor(listName)}/*`).as('updateView');

    clickListViewMenuItem('Update view');

    cy.wait('@updateView')
        .its('response.statusCode')
        .should('equal', 200);
});

Then(/^the (event|tracker|program stage) view is still shared with (?:the other user|you)$/, (listName) => {
    const resource = resourceFor(listName);

    lookUpOtherUser().then(({ id: userId }) => {
        findViewByName(resource).then(({ id: viewId }) => {
            cy.buildApiUrl(`${resource}/${viewId}?fields=sharing`)
                .then(url => cy.request({ url, auth: asAdmin() }))
                .its('body.sharing')
                .should((sharing) => {
                    expect(Object.keys(sharing.users), 'users the view is shared with').to.include(userId);
                    expect(sharing.users[userId].access, 'access level of the shared user').to.equal(VIEW_AND_EDIT);
                    expect(sharing.public, 'public access').to.equal(NO_ACCESS);
                });
        });
    });
});

Then('the view no longer has unsaved changes', () => {
    openListViewMenu();
    cy.get(LIST_VIEW_MENU).should('not.contain', 'Update view');
});
