import { useLocation } from 'react-router-dom';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../utils/routing';

export const useSetProgramId = () => {
    const { navigate } = useNavigate();
    const { pathname } = useLocation();
    const { selectedTemplateId, ...restOfQueries } = useLocationQuery();

    const setProgramId = (programId: string, pageToPush: string = pathname) => {
        navigate(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries, programId })}`);
    };

    const setProgramIdAndResetEnrollmentContext = (programId: string, pageToPush: string = pathname) => {
        navigate(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries, programId, enrollmentId: 'AUTO' })}`);
    };

    return {
        setProgramId,
        setProgramIdAndResetEnrollmentContext,
    };
};
