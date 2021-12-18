// @flow
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';

export const useSetOrgUnitId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const setOrgUnitId = (orgUnitId: string, pageToPush: string = pathname, withRestOfQueries?: ?boolean = true) => {
        const restOfQueries = getUrlQueries();
        withRestOfQueries
            ? history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries, orgUnitId })}`)
            : history.push(`${pageToPush}?${buildUrlQueryString({ orgUnitId })}`);
    };

    return { setOrgUnitId };
};
