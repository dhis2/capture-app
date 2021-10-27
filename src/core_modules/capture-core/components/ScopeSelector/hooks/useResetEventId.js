// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useResetEventId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetEventId = (pageToPush: string = pathname) => {
        const { programId, orgUnitId, teiId, enrollmentId } = getUrlQueries();
        history.push(`${pageToPush}?${urlArguments({ programId, orgUnitId, teiId, enrollmentId })}`);
    };

    return { resetEventId };
};
