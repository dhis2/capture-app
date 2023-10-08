export const filterInstanceVersion = (skip) => {
    const { tags } = window.testState.pickle;
    if (!tags || !tags.length) {
        return;
    }

    const versionTags = tags
        .map(({ name }) => /^@v([><=]*)(\d+)$/.exec(name))
        .filter(versionTag => versionTag);

    if (!versionTags.length) {
        return;
    }

    const currentInstanceVersion = Number(/[.](\d+)/.exec(Cypress.env('dhis2InstanceVersion'))[1]);

    const operation = {
        '>=': (instanceVersion, testVersion) => instanceVersion >= testVersion,
        '<=': (instanceVersion, testVersion) => instanceVersion <= testVersion,
        '>': (instanceVersion, testVersion) => instanceVersion > testVersion,
        '<': (instanceVersion, testVersion) => instanceVersion < testVersion,
        '=': (instanceVersion, testVersion) => instanceVersion === testVersion,
    };

    const shouldRun = versionTags
        .some((versionTag) => {
            const version = Number(versionTag[2]);
            const operator = versionTag[1] || '=';

            if (!operation[operator] || !currentInstanceVersion) {
                return false;
            }

            const test = operation[operator](currentInstanceVersion, version);
            return test;
        });

    cy.log(`Instance version: ${currentInstanceVersion}`);
    cy.log(`Test version: ${versionTags.map(versionTag => versionTag[0]).join(', ')}`);

    !shouldRun && skip();
};
