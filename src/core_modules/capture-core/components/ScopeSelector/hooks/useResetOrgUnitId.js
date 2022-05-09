// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';

export const useResetOrgUnitId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetOrgUnitId = (pageToPush: string = pathname) => {
        const { orgUnitId, ...restOfQueries } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    const resetOrgUnitIdAndViewEventId = (pageToPush: string = pathname) => {
        const { orgUnitId, viewEventId, ...restOfQueries } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    return { resetOrgUnitId, resetOrgUnitIdAndViewEventId };
};
