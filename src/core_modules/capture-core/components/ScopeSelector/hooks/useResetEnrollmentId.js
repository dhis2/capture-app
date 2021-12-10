// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';

export const useResetEnrollmentId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetEnrollmentId = (pageToPush: string = pathname) => {
        const { programId, orgUnitId, teiId } = getUrlQueries();
        history.push(buildUrlQueryString(pageToPush, { programId, orgUnitId, teiId }));
    };

    return { resetEnrollmentId };
};
