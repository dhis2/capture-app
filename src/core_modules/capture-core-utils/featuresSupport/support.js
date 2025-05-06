// @flow
export const FEATURES = Object.freeze({
    storeProgramStageWorkingList: 'storeProgramStageWorkingList',
    multiText: 'multiText',
    customIcons: 'customIcons',
    newTrackedEntityQueryParam: 'newTrackedEntityQueryParam',
    exportablePayload: 'exportablePayload',
    changelogs: 'changelogs',
    changelogsV2: 'changelogsV2',
    trackerImageEndpoint: 'trackerImageEndpoint',
    trackerFileEndpoint: 'trackerFileEndpoint',
    trackedEntitiesCSV: 'trackedEntitiesCSV',
    newUIDsSeparator: 'newUIDsSeparator',
    newEntityFilterQueryParam: 'newEntityFilterQueryParam',
    newNoteEndpoint: 'newNoteEndpoint',
    newPagingQueryParam: 'newPagingQueryParam',
    newOrgUnitModeQueryParam: 'newOrgUnitModeQueryParam',
    moreGenericErrorMessages: 'moreGenericErrorMessages',
    sendEmptyScheduledAt: 'sendEmptyScheduledAt',
    kotlinRuleEngine: 'kotlinRuleEngine',
    orgUnitReplaceOuQueryParam: 'orgUnitReplaceOuQueryParam',
    enrollmentStatusReplaceProgramStatusQueryParam: 'enrollmentStatusReplaceProgramStatusQueryParam',
});

// The first minor version that supports the feature
const MINOR_VERSION_SUPPORT = Object.freeze({
    [FEATURES.storeProgramStageWorkingList]: 40,
    [FEATURES.multiText]: 41,
    [FEATURES.customIcons]: 41,
    [FEATURES.exportablePayload]: 41,
    [FEATURES.trackerImageEndpoint]: 41,
    [FEATURES.trackerFileEndpoint]: 41,
    [FEATURES.newTrackedEntityQueryParam]: 41,
    [FEATURES.changelogs]: 41,
    [FEATURES.changelogsV2]: 42,
    [FEATURES.trackedEntitiesCSV]: 40,
    [FEATURES.newUIDsSeparator]: 41,
    [FEATURES.newEntityFilterQueryParam]: 41,
    [FEATURES.newNoteEndpoint]: 42,
    [FEATURES.newPagingQueryParam]: 41,
    [FEATURES.newOrgUnitModeQueryParam]: 41,
    [FEATURES.moreGenericErrorMessages]: 42,
    [FEATURES.sendEmptyScheduledAt]: 41,
    [FEATURES.kotlinRuleEngine]: 42,
    [FEATURES.orgUnitReplaceOuQueryParam]: 42,
    [FEATURES.enrollmentStatusReplaceProgramStatusQueryParam]: 42,
});

export const hasAPISupportForFeature = (minorVersion: string | number, featureName: string) =>
    MINOR_VERSION_SUPPORT[featureName] <= Number(minorVersion) || false;
