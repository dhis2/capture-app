export const shouldUseNewDashboard = (userDataStore, dataStore, temp, programId) =>
    userDataStore?.[programId] || temp?.[programId] || (userDataStore?.[programId] !== false && dataStore?.[programId]);
