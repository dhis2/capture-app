// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';

export const useResetStageId = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { programId, orgUnitId, teiId, enrollmentId } = useLocationQuery();


    const resetStageId = (pageToPush: string = pathname) => {
        history.push(`${pageToPush}?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
    };

    return { resetStageId };
};
