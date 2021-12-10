// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';

export const useResetProgramId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetProgramId = (pageToPush: string = pathname) => {
        const { programId, ...restOfQueries } = getUrlQueries();
        history.push(buildUrlQueryString(pageToPush, { ...restOfQueries }));
    };

    const resetProgramIdAndEnrollmentContext = (pageToPush: string = pathname) => {
        const { programId, enrollmentId, stageId, eventId, ...restOfQueries } = getUrlQueries();
        history.push(buildUrlQueryString(pageToPush, { ...restOfQueries }));
    };

    return { resetProgramId, resetProgramIdAndEnrollmentContext };
};
