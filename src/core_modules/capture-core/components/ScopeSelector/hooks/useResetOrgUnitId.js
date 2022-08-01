// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';

export const useResetOrgUnitId = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { orgUnitId, ...restOfQueries } = useLocationQuery();


    const resetOrgUnitId = (pageToPush: string = pathname) => {
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    return { resetOrgUnitId };
};
