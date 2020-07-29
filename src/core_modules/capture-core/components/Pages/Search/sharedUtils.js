export const navigateToTrackedEntityDashboard = (teiId, orgUnitId, scopeSearchParam) => {
    const oldTrackerCaptureAppUrl = (process.env.REACT_APP_TRACKER_CAPTURE_APP_PATH || '..').replace(/\/$/, '');
    const urlParameters = `/#/dashboard?tei=${teiId}&ou=${orgUnitId}&${scopeSearchParam}`;
    window.location.href = `${oldTrackerCaptureAppUrl}${urlParameters}`;
};
