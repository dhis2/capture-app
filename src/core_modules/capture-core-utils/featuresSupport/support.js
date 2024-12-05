// @flow
export const FEATURES = Object.freeze({
    storeProgramStageWorkingList: 'storeProgramStageWorkingList',
    multiText: 'multiText',
    customIcons: 'customIcons',
    newTransferQueryParam: 'newTransferQueryParam',
    exportablePayload: 'exportablePayload',
    changelogs: 'changelogs',
    trackerImageEndpoint: 'trackerImageEndpoint',
    trackerFileEndpoint: 'trackerFileEndpoint',
    trackedEntitiesCSV: 'trackedEntitiesCSV',
    newAocApiSeparator: 'newAocApiSeparator',
});

// The first minor version that supports the feature
const MINOR_VERSION_SUPPORT = Object.freeze({
    [FEATURES.storeProgramStageWorkingList]: 40,
    [FEATURES.multiText]: 41,
    [FEATURES.customIcons]: 41,
    [FEATURES.exportablePayload]: 41,
    [FEATURES.trackerImageEndpoint]: 41,
    [FEATURES.trackerFileEndpoint]: 41,
    [FEATURES.newTransferQueryParam]: 41,
    [FEATURES.changelogs]: 41,
    [FEATURES.trackedEntitiesCSV]: 40,
    [FEATURES.newAocApiSeparator]: 41,
});

export const hasAPISupportForFeature = (minorVersion: string | number, featureName: string) =>
    MINOR_VERSION_SUPPORT[featureName] <= Number(minorVersion) || false;
