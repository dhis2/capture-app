// @flow
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';

export const useResetTeiId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const resetTeiId = (pageToPush: string = pathname) => {
        const { programId, orgUnitId } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ programId, orgUnitId })}`);
    };

    return { resetTeiId };
};
