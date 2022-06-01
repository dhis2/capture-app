// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';
import type { PageContext } from './types';

export const useResetProgramId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetProgramId = (pageToPush: string = pathname) => {
        const { programId, ...restOfQueries } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    const resetProgramIdAndEnrollmentContext = (pageToPush: string = pathname, pageContext: PageContext) => {
        const {
            programId,
            enrollmentId,
            stageId,
            eventId,
            teiId = pageContext?.teiId,
            ...restOfQueries
        } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries, teiId, enrollmentId: 'AUTO' })}`);
    };

    const resetProgramIdAndTeiId = (pageToPush: string = pathname) => {
        const { programId, teiId, ...restOfQueries } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    return { resetProgramId, resetProgramIdAndEnrollmentContext, resetProgramIdAndTeiId };
};
