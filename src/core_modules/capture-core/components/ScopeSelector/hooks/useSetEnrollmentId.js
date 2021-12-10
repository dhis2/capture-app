// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';

export const useSetEnrollmentId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const setEnrollmentId = ({ enrollmentId, pageToPush = pathname, shouldReplaceHistory }: Object) => {
        const { programId, orgUnitId, teiId } = getUrlQueries();
        const url = buildUrlQueryString(pageToPush, {
            programId,
            orgUnitId,
            teiId,
            enrollmentId,
        });
        shouldReplaceHistory ? history.replace(url) : history.push(url);
    };

    return { setEnrollmentId };
};
