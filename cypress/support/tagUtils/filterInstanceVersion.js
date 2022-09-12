export const filterInstanceVersion = (skip) => {
    const { tags } = window.testState.currentScenario;
    if (!tags || !tags.length) {
        return;
    }

    cy.log(JSON.stringify(tags));

    const versionTags = tags
        .map(({ name }) => /^@v([><=]*)(\d+)$/.exec(name))
        .filter(versionTag => versionTag);

    if (!versionTags.length) {
        return;
    }

    const currentInstanceVersion = Number(Cypress.env('dhis2InstanceVersion'));

    const operation = {
        '>=': (instanceVersion, testVersion) => instanceVersion >= testVersion,
        '<=': (instanceVersion, testVersion) => instanceVersion <= testVersion,
        '>': (instanceVersion, testVersion) => instanceVersion > testVersion,
        '<': (instanceVersion, testVersion) => instanceVersion < testVersion,
        '=': (instanceVersion, testVersion) => instanceVersion === testVersion,
    };

    const shouldRun = versionTags
        .some((versionTag) => {
            cy.log(JSON.stringify(versionTag));
            const version = Number(versionTag[2]);
            const operator = versionTag[1] || '=';
            return operation[operator]?.(currentInstanceVersion, version) ?? false;
        });

    !shouldRun && skip();
};
