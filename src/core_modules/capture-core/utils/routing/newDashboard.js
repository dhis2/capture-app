export const shouldUseNewDashboard = (userDataStore, dataStore, programId) =>
    userDataStore?.[programId] || (userDataStore?.[programId] !== false && dataStore?.[programId]);
