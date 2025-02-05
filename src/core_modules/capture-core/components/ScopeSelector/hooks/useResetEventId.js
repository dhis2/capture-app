// @flow
import { useLocation } from 'react-router-dom';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import type { PageContext } from './types';

export const useResetEventId = () => {
    const { navigate } = useNavigate();
    const { pathname } = useLocation();
    const { programId, orgUnitId, teiId, enrollmentId } = useLocationQuery();

    const resetEventId = (pageToPush: string = pathname, pageContext?: PageContext) => {
        navigate(`${pageToPush}?${buildUrlQueryString({
            programId, orgUnitId, teiId, enrollmentId: enrollmentId ?? pageContext?.enrollmentId,
        })}`);
    };

    return { resetEventId };
};
