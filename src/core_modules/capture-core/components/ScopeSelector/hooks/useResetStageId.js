// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useResetStageId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetStageId = (pageToPush: string = pathname) => {
        const { programId, orgUnitId, teiId, enrollmentId } = getUrlQueries();
        history.push(`${pageToPush}?${urlArguments({ programId, orgUnitId, teiId, enrollmentId })}`);
    };

    return { resetStageId };
};
