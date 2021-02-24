import { config } from 'd2';

export const navigateToTrackedEntityDashboard = (teiId, orgUnitId, scopeSearchParam, currentUrl) => {
    const { baseUrl } = config;
    const instanceBaseUrl = baseUrl.split('/api')[0];

    const returnUrl =
      // when developing locally the following will always be false
      window.location.href.includes(instanceBaseUrl)
          ?
          window.location.href.split(instanceBaseUrl)[1]
          :
          `/dhis-web-capture/#${currentUrl}`;

    const base64Url = btoa(returnUrl);


    // `returnUrl` serves the purpose that the tracker capture app can sent the user back to the capture app.
    // In the future when there is not gonna be linking between the two apps this wont be needed.
    window.location.href = `${instanceBaseUrl}/dhis-web-tracker-capture/#/dashboard?tei=${teiId}&ou=${orgUnitId}&${scopeSearchParam}&returnUrl=${base64Url}`;
};
