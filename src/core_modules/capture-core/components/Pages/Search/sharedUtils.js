import { config } from 'd2';

export const navigateToTrackedEntityDashboard = (teiId, orgUnitId, scopeSearchParam) => {
    const { baseUrl } = config;
    const instanceBaseUrl = baseUrl.split('/api')[0];
    window.location.href = `${instanceBaseUrl}/dhis-web-tracker-capture/#/dashboard?tei=${teiId}&ou=${orgUnitId}&${scopeSearchParam}`;
};
