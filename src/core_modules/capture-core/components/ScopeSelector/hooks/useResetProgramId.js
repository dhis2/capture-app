// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { buildUrlQueryString, getLocationQuery } from '../../../utils/routing';

export const useResetProgramId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetProgramId = (pageToPush: string = pathname) => {
        const { programId, ...restOfQueries } = getLocationQuery();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    const resetProgramIdAndEnrollmentContext = (pageToPush: string = pathname) => {
        const { programId, enrollmentId, stageId, eventId, ...restOfQueries } = getLocationQuery();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries, enrollmentId: 'AUTO' })}`);
    };

    const resetProgramIdAndTeiId = (pageToPush: string = pathname) => {
        const { programId, teiId, ...restOfQueries } = getLocationQuery();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    return { resetProgramId, resetProgramIdAndEnrollmentContext, resetProgramIdAndTeiId };
};
