// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';

export const useSetEnrollmentId = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { programId, orgUnitId, teiId } = useLocationQuery();

    const setEnrollmentId = ({ enrollmentId, pageToPush = pathname, shouldReplaceHistory }: Object) => {
        const url = `${pageToPush}?${buildUrlQueryString({
            programId,
            orgUnitId,
            teiId,
            enrollmentId,
        })}`;
        shouldReplaceHistory ? history.replace(url) : history.push(url);
    };

    return { setEnrollmentId };
};
