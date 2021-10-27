// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useResetProgramId = () => {
    const history = useHistory();
    const { pathname }: string = useLocation();

    const resetProgramId = (pageToPush: string = pathname) => {
        const { programId, ...restOfQueries } = getUrlQueries();
        history.push(`${pageToPush}?${urlArguments({ ...restOfQueries })}`);
    };

    const resetProgramIdAndEnrollmentContext = (pageToPush: string = pathname) => {
        const { programId, enrollmentId, stageId, eventId, ...restOfQueries } = getUrlQueries();
        history.push(`${pageToPush}?${urlArguments({ ...restOfQueries })}`);
    };

    return { resetProgramId, resetProgramIdAndEnrollmentContext };
};
