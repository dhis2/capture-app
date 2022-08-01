// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import type { PageContext } from './types';

export const useResetEnrollmentId = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { programId, orgUnitId, teiId } = useLocationQuery();

    const resetEnrollmentId = (pageToPush: string = pathname, pageContext?: PageContext) => {
        history.push(`${pageToPush}?${buildUrlQueryString({
            programId: programId ?? pageContext?.programId,
            orgUnitId,
            teiId: teiId ?? pageContext?.teiId,
        })}`);
    };

    return { resetEnrollmentId };
};
