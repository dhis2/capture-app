// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';
import type { PageContext } from './types';

export const useResetTeiId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetTeiId = (pageToPush: string = pathname, pageContext?: PageContext) => {
        const { programId = pageContext?.programId, orgUnitId } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ programId, orgUnitId })}`);
    };

    return { resetTeiId };
};
