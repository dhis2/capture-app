export const filterInstanceVersion = (skip) => {
    const { tags } = window.testState.currentScenario;
    if (!tags || !tags.length) {
        return;
    }

    const versionTags = tags
        .map(({ name }) => /@v(\d+)([+-]*)/.exec(name))
        .filter(versionTag => versionTag);

    if (!versionTags.length) {
        return;
    }

    const currentInstanceVersion = Number(Cypress.env('dhis2InstanceVersion'));

    const shouldRun = versionTags
        .some((versionTag) => {
            cy.log(JSON.stringify(versionTag));
            const version = Number(versionTag[1]);
            const operator = versionTag[2];
            if (operator) {
                if (operator === '+') {
                    return currentInstanceVersion >= version;
                }
                return currentInstanceVersion <= version;
            }
            return currentInstanceVersion === version;
        });

    !shouldRun && skip();
};
