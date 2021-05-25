import { config } from 'd2';

export const navigateToTrackedEntityDashboard = (teiId, orgUnitId, scopeSearchParam, currentUrl) => {
    const { baseUrl } = config;
    const instanceBaseUrl = baseUrl.split('/api')[0];
    const base64Url = btoa(`/dhis-web-capture/#${currentUrl}`);

    // `returnUrl` serves the purpose that the tracker capture app can sent the user back to the capture app.
    // In the future when there is not gonna be linking between the two apps this wont be needed.
    // Using setTimout to prevent a false positive error message to appear when the app is reopened (error saving tracked entity instance or error saving enrollment)
    setTimeout(() => {
        window.location.href = `${instanceBaseUrl}/dhis-web-tracker-capture/#/dashboard?tei=${teiId}&ou=${orgUnitId}&${scopeSearchParam}&returnUrl=${base64Url}`;
    }, 50);
};
