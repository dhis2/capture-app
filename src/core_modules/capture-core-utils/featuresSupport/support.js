// @flow
export const FEATURES = Object.freeze({
    programStageWorkingList: 'programStageWorkingList',
    storeProgramStageWorkingList: 'storeProgramStageWorkingList',
    multiText: 'multiText',
    customIcons: 'customIcons',
    exportablePayload: 'exportablePayload',
    trackerImageEndpoint: 'trackerImageEndpoint',
});

// The first minor version that supports the feature
const MINOR_VERSION_SUPPORT = Object.freeze({
    [FEATURES.programStageWorkingList]: 39,
    [FEATURES.storeProgramStageWorkingList]: 40,
    [FEATURES.multiText]: 41,
    [FEATURES.customIcons]: 41,
    [FEATURES.exportablePayload]: 41,
    [FEATURES.trackerImageEndpoint]: 41,
});

export const hasAPISupportForFeature = (minorVersion: string | number, featureName: string) =>
    MINOR_VERSION_SUPPORT[featureName] <= Number(minorVersion) || false;
