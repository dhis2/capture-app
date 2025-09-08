import { useLocation } from 'react-router-dom';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import type { PageContext } from './types';

export const useResetEnrollmentId = () => {
    const { navigate } = useNavigate();
    const { pathname } = useLocation();
    const { programId, orgUnitId, teiId } = useLocationQuery();

    const resetEnrollmentId = (pageToPush: string = pathname, pageContext?: PageContext) => {
        navigate(`${pageToPush}?${buildUrlQueryString({
            programId: programId ?? pageContext?.programId,
            orgUnitId,
            teiId: teiId ?? pageContext?.teiId,
        })}`);
    };

    return { resetEnrollmentId };
};
