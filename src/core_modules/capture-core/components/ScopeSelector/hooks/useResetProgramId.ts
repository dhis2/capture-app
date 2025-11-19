import { useLocation } from 'react-router-dom';
import { useNavigate, buildUrlQueryString, getLocationQuery } from '../../../utils/routing';
import type { PageContext } from './types';

export const useResetProgramId = () => {
    const { navigate } = useNavigate();
    const { pathname } = useLocation();

    const resetProgramId = (pageToPush: string = pathname) => {
        const { programId, ...restOfQueries } = getLocationQuery();
        navigate(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
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
        navigate(`${pageToPush}?${buildUrlQueryString({
            ...restOfQueries,
            teiId: teiId ?? pageContext?.teiId,
            enrollmentId: 'AUTO',
        })}`);
    };

    const resetProgramIdAndTeiId = (pageToPush: string = pathname) => {
        const { programId, teiId, ...restOfQueries } = getLocationQuery();
        navigate(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    const resetProgramIdAndSelectedTemplateId = (pageToPush: string = pathname) => {
        const { programId, selectedTemplateId, ...restOfQueries } = getLocationQuery();
        navigate(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    return {
        resetProgramId,
        resetProgramIdAndEnrollmentContext,
        resetProgramIdAndTeiId,
        resetProgramIdAndSelectedTemplateId,
    };
};
