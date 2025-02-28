// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../utils/routing';

export const useSetEnrollmentId = () => {
    const history = useHistory();
    const { navigate } = useNavigate();
    const { pathname } = useLocation();
    const { programId, orgUnitId, teiId } = useLocationQuery();

    const setEnrollmentId = ({ enrollmentId, pageToPush = pathname, shouldReplaceHistory }: Object) => {
        const url = `${pageToPush}?${buildUrlQueryString({
            programId,
            orgUnitId,
            teiId,
            enrollmentId,
        })}`;
        shouldReplaceHistory ? history.replace(url) : navigate(url);
    };

    return { setEnrollmentId };
};
