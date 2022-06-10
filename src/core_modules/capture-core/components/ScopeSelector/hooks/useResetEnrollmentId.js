// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';

export const useResetEnrollmentId = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { programId, orgUnitId, teiId } = useLocationQuery();

    const resetEnrollmentId = (pageToPush: string = pathname) => {
        history.push(`${pageToPush}?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    };

    return { resetEnrollmentId };
};
