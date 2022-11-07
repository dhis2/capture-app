// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { buildUrlQueryString, getLocationQuery } from '../../../utils/routing';
import type { PageContext } from './types';

export const useResetProgramId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetProgramId = (pageToPush: string = pathname) => {
        const { programId, ...restOfQueries } = getLocationQuery();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    const resetProgramIdAndEnrollmentContext = (pageToPush: string = pathname, pageContext: PageContext) => {
        const {
            programId,
            enrollmentId,
            stageId,
            eventId,
            teiId,
            ...restOfQueries
        } = getLocationQuery();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries, teiId: teiId ?? pageContext?.teiId, enrollmentId: 'AUTO' })}`);
    };

    const resetProgramIdAndTeiId = (pageToPush: string = pathname) => {
        const { programId, teiId, ...restOfQueries } = getLocationQuery();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    const resetProgramIdAndSelectedTemplateId = (pageToPush: string = pathname) => {
        const { programId, selectedTemplateId, ...restOfQueries } = getLocationQuery();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    return {
        resetProgramId,
        resetProgramIdAndEnrollmentContext,
        resetProgramIdAndTeiId,
        resetProgramIdAndSelectedTemplateId,
    };
};
