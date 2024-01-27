// @flow

export const shouldUseNewDashboard = ({
    userDataStore,
    dataStore,
    programId,
    teiId,
}: {
    userDataStore: any,
    dataStore: any,
    programId: ?string,
    teiId?: ?string,
}): boolean =>
    Boolean(!programId && teiId) || // Check for when a TEI is created/searched without being enrolled in any program. In this case the URL has the enrollmentId set to 'AUTO'.
    userDataStore?.[programId] ||
    (userDataStore?.[programId] !== false && dataStore?.[programId]);
