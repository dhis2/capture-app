// @flow
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { buildUrlQueryString } from '../../../utils/routing';
import { getUrlQueries } from '../../../utils/url';

export const useSetEnrollmentId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const setEnrollmentId = ({ enrollmentId, pageToPush = pathname, shouldReplaceHistory }: Object) => {
        const { programId, orgUnitId, teiId } = getUrlQueries();
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
