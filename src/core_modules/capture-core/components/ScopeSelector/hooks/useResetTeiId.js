// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';

export const useResetTeiId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetTeiId = (pageToPush: string = pathname) => {
        const { programId, orgUnitId } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ programId, orgUnitId })}`);
    };

    return { resetTeiId };
};
