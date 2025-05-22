import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Then('you should see the app main selections', () => {
    cy.get('[data-test="org-unit-selector-container"]');
    cy.get('[data-test="program-selector-container"]');
});

Given('you open the App without auth cookie', () => {
    cy.visit('/');
});

Then('you should see the login prompt', () => {
    cy.get('[data-test="dhis2-adapter-loginsubmit"]');

    cy.get('[data-test="dhis2-adapter-loginname"]')
        .find('#j_username');

    cy.get('[data-test="dhis2-adapter-loginpassword"]')
        .find('#j_password');

    cy.get('#j_username');

    cy.get('#j_password');
});

When('you fill in credentials', () => {
    cy.get('[data-test="dhis2-adapter-loginname"]')
        .find('input')
        .type('admin');

    cy.get('[data-test="dhis2-adapter-loginpassword"]')
        .find('input')
        .type('district');
});

When('you sign in', () => {
    cy.get('form')
        .submit();
});

Then('you should see the header bar', () => {
    cy.get('[data-test="headerbar-title"]');
});

const hashSHA256 = async (input) => {
    const inputUint8 = new TextEncoder().encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', inputUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

const openDb = (win, name) =>
    new Promise((resolve, reject) => {
        const request = win.indexedDB.open(name);

        request.onerror = reject;

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };
    });

const getObjectStoreContents = db =>
    new Promise((resolve, reject) => {
        const objectStoreName = 'userCaches';

        const objectStore = db
            .transaction(objectStoreName, 'readonly')
            .objectStore(objectStoreName);

        const accessHistoryMetadataRequest = objectStore.get('accessHistoryMetadata');

        accessHistoryMetadataRequest.onsuccess = (accessHistoryEvent) => {
            const accessHistoryDataRequest = objectStore.get('accessHistoryData');

            accessHistoryDataRequest.onsuccess = (offlineDataEvent) => {
                resolve({
                    userCachesMetadata: accessHistoryEvent.target.result.values,
                    userCachesData:
                        offlineDataEvent.target.result.values,
                });
            };

            accessHistoryDataRequest.onerror = reject;
        };

        accessHistoryMetadataRequest.onerror = reject;
    });


Then('IndexedDBs matching the naming pattern and structure should be found', () => {
    let userId;
    cy.buildApiUrl('me?fields=id')
        .then(url => cy.request(url))
        .then(({ body: { id } }) => {
            userId = id;
        });

    cy.window().then(async (win) => {
        const instanceDbName = `dhis2ca-${await hashSHA256(Cypress.env('dhis2BaseUrl'))}`;
        const userMetadataDbName = `${instanceDbName}-${userId}-metadata`;
        const userDataDbName = `${instanceDbName}-${userId}-data`;

        const databaseMatches = (await win.indexedDB.databases())
            .filter(({ name }) => [instanceDbName, userMetadataDbName, userDataDbName].includes(name));

        expect(databaseMatches).to.have.length(3);

        const instanceDb = await openDb(win, instanceDbName);
        const { userCachesMetadata, userCachesData } = await getObjectStoreContents(instanceDb);

        expect(userCachesMetadata).to.include(userMetadataDbName);
        expect(userCachesData).to.include(userDataDbName);

        instanceDb.close();
    });
});
