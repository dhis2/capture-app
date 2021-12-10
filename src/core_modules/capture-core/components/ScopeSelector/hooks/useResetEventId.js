// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';

export const useResetEventId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetEventId = (pageToPush: string = pathname) => {
        const { programId, orgUnitId, teiId, enrollmentId } = getUrlQueries();
        history.push(buildUrlQueryString(pageToPush, { programId, orgUnitId, teiId, enrollmentId }));
    };

    return { resetEventId };
};
