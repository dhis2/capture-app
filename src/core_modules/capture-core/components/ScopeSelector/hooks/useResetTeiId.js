// @flow
import { useLocation } from 'react-router-dom';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import type { PageContext } from './types';

export const useResetTeiId = () => {
    const { navigate } = useNavigate();
    const { pathname } = useLocation();
    const { programId, orgUnitId } = useLocationQuery();

    const resetTeiId = (pageToPush: string = pathname, pageContext?: PageContext) => {
        navigate(`${pageToPush}?${buildUrlQueryString({
            programId: programId ?? pageContext?.programId, orgUnitId,
        })}`);
    };

    return { resetTeiId };
};
