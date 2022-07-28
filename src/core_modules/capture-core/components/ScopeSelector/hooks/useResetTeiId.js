// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import type { PageContext } from './types';

export const useResetTeiId = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { programId, orgUnitId } = useLocationQuery();

    const resetTeiId = (pageToPush: string = pathname, pageContext?: PageContext) => {
        history.push(`${pageToPush}?${buildUrlQueryString({
            programId: programId ?? pageContext?.programId, orgUnitId,
        })}`);
    };

    return { resetTeiId };
};
