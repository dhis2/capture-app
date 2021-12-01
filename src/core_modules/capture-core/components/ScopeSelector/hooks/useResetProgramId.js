// @flow
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { buildUrlQueryString } from '../../../utils/routing';
import { getUrlQueries } from '../../../utils/url';

export const useResetProgramId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const resetProgramId = (pageToPush: string = pathname) => {
        const { programId, ...restOfQueries } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    const resetProgramIdAndEnrollmentContext = (pageToPush: string = pathname) => {
        const { programId, enrollmentId, stageId, eventId, ...restOfQueries } = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    return { resetProgramId, resetProgramIdAndEnrollmentContext };
};
