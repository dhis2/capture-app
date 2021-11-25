// @flow
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';

export const useResetOrgUnitId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const resetOrgUnitId = (pageToPush: string = pathname) => {
        const { orgUnitId, ...restOfQueries } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    return { resetOrgUnitId };
};
