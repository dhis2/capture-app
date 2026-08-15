export const FEATURES = Object.freeze({
    changelogsV2: 'changelogsV2',
    newNoteEndpoint: 'newNoteEndpoint',
    moreGenericErrorMessages: 'moreGenericErrorMessages',
    kotlinRuleEngine: 'kotlinRuleEngine',
    orgUnitReplaceOuQueryParam: 'orgUnitReplaceOuQueryParam',
    enrollmentStatusReplaceProgramStatusQueryParam: 'enrollmentStatusReplaceProgramStatusQueryParam',
    emptyValueFilter: 'emptyValueFilter',
    customTerminologyPlurals: 'customTerminologyPlurals',
});

const MINOR_VERSION_SUPPORT = Object.freeze({
    [FEATURES.changelogsV2]: 42,
    [FEATURES.newNoteEndpoint]: 42,
    [FEATURES.moreGenericErrorMessages]: 42,
    [FEATURES.kotlinRuleEngine]: 42,
    [FEATURES.orgUnitReplaceOuQueryParam]: 42,
    [FEATURES.enrollmentStatusReplaceProgramStatusQueryParam]: 42,
    [FEATURES.emptyValueFilter]: 42,
    [FEATURES.customTerminologyPlurals]: 43,
});

export const hasAPISupportForFeature = (minorVersion: string | number, featureName: string) =>
    MINOR_VERSION_SUPPORT[featureName] <= Number(minorVersion) || false;
