import { config } from 'd2';

export const teiDashboardUrl = (teiId, orgUnitId, scopeSearchParam) => {
    const { baseUrl } = config;
    const instanceBaseUrl = baseUrl.split('/api')[0];
    return `${instanceBaseUrl}/dhis-web-tracker-capture/#/dashboard?tei=${teiId}&ou=${orgUnitId}&${scopeSearchParam}`;
};


export const navigateToTrackedEntityDashboard = (teiId, orgUnitId, scopeSearchParam) => {
    window.location.href = teiDashboardUrl(teiId, orgUnitId, scopeSearchParam);
};
