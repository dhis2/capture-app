// @flow
export const FEATURES = Object.freeze({
    programStageWorkingList: 'programStageWorkingList',
    storeProgramStageWorkingList: 'storeProgramStageWorkingList',
    customIcons: 'customIcons',
});

// The first minor version that supports the feature
const MINOR_VERSION_SUPPORT = Object.freeze({
    [FEATURES.programStageWorkingList]: 39,
    [FEATURES.storeProgramStageWorkingList]: 40,
    [FEATURES.customIcons]: 41,
});

export const hasAPISupportForFeature = (minorVersion: string, featureName: string) =>
    MINOR_VERSION_SUPPORT[featureName] <= Number(minorVersion) || false;
