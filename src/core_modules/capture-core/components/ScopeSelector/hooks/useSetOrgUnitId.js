// @flow
import { useLocation } from 'react-router-dom';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../utils/routing';

export const useSetOrgUnitId = () => {
    const { navigate } = useNavigate();
    const { pathname } = useLocation();

    const restOfQueries = useLocationQuery();

    const setOrgUnitId = (orgUnitId: string, pageToPush: string = pathname, withRestOfQueries?: ?boolean = true) => {
        withRestOfQueries
            ? navigate(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries, orgUnitId })}`)
            : navigate(`${pageToPush}?${buildUrlQueryString({ orgUnitId })}`);
    };

    return { setOrgUnitId };
};
