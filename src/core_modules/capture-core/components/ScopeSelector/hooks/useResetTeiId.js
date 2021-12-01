// @flow
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { buildUrlQueryString } from '../../../utils/routing';
import { getUrlQueries } from '../../../utils/url';

export const useResetTeiId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const resetTeiId = (pageToPush: string = pathname) => {
        const { programId, orgUnitId } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ programId, orgUnitId })}`);
    };

    return { resetTeiId };
};
