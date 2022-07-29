// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';

export const useSetOrgUnitId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const restOfQueries = useLocationQuery();

    const setOrgUnitId = (orgUnitId: string, pageToPush: string = pathname, withRestOfQueries?: ?boolean = true) => {
        withRestOfQueries
            ? history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries, orgUnitId })}`)
            : history.push(`${pageToPush}?${buildUrlQueryString({ orgUnitId })}`);
    };

    return { setOrgUnitId };
};
