// @flow
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useResetEnrollmentId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const resetEnrollmentId = (pageToPush: string = pathname) => {
        const { programId, orgUnitId, teiId } = getUrlQueries();
        history.push(`${pageToPush}?${urlArguments({ programId, orgUnitId, teiId })}`);
    };

    return { resetEnrollmentId };
};
