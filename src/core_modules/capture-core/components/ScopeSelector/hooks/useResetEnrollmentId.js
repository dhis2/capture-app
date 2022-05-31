// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';
import type { PageContext } from './types';

export const useResetEnrollmentId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetEnrollmentId = (pageToPush: string = pathname, pageContext?: PageContext) => {
        const { programId = pageContext?.programId, orgUnitId, teiId = pageContext?.teiId } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    };

    return { resetEnrollmentId };
};
