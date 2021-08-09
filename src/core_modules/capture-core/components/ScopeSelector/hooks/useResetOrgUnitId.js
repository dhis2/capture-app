// @flow
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useResetOrgUnitId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const resetOrgUnitId = (pageToPush: string = pathname) => {
        const { orgUnitId, ...restOfQueries } = getUrlQueries();
        history.push(`${pageToPush}?${urlArguments({ ...restOfQueries })}`);
    };

    return { resetOrgUnitId };
};
