// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useResetEnrollmentId = () => {
    const history = useHistory();
    const { pathname }: string = useLocation();

    const resetEnrollmentId = (pageToPush: string = pathname) => {
        const { programId, orgUnitId, teiId } = getUrlQueries();
        history.push(`${pageToPush}?${urlArguments({ programId, orgUnitId, teiId })}`);
    };

    return { resetEnrollmentId };
};
