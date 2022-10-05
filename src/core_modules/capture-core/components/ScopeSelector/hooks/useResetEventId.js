// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import type { PageContext } from './types';

export const useResetEventId = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { programId, orgUnitId, teiId, enrollmentId } = useLocationQuery();

    const resetEventId = (pageToPush: string = pathname, pageContext?: PageContext) => {
        history.push(`${pageToPush}?${buildUrlQueryString({
            programId, orgUnitId, teiId, enrollmentId: enrollmentId ?? pageContext?.enrollmentId,
        })}`);
    };

    return { resetEventId };
};
