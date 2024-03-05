
const operation = {
    '>=': (instanceVersion, testVersion) => instanceVersion >= testVersion,
    '<=': (instanceVersion, testVersion) => instanceVersion <= testVersion,
    '>': (instanceVersion, testVersion) => instanceVersion > testVersion,
    '<': (instanceVersion, testVersion) => instanceVersion < testVersion,
    '=': (instanceVersion, testVersion) => instanceVersion === testVersion,
};

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

    const shouldRun = versionTags
        .some((versionTag) => {
            const version = Number(versionTag[2]);
            const operator = versionTag[1] || '=';

            if (!operation[operator] || !currentInstanceVersion) {
                return false;
            }

            return operation[operator](currentInstanceVersion, version);
        });

    if (!shouldRun) {
        skip();
    }
};

export const hasVersionSupport = (inputVersion) => {
    const supportedVersion = /^@v([><=]*)(\d+)$/.exec(inputVersion);
    const currentInstanceVersion = Number(/[.](\d+)/.exec(Cypress.env('dhis2InstanceVersion'))[1]);

    const version = Number(supportedVersion[2]);
    const operator = supportedVersion[1] || '=';

    if (!operation[operator] || !currentInstanceVersion) {
        return false;
    }

    return operation[operator](currentInstanceVersion, version);
};
