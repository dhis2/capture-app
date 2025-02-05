// @flow
import { useLocation } from 'react-router-dom';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../utils/routing';

export const useResetOrgUnitId = () => {
    const { navigate } = useNavigate();
    const { pathname } = useLocation();
    const { orgUnitId, ...restOfQueries } = useLocationQuery();


    const resetOrgUnitId = (pageToPush: string = pathname) => {
        navigate(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    return { resetOrgUnitId };
};
