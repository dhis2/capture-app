// @flow
import { useHistory } from 'react-router';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useResetEnrollmentId = () => {
    const history = useHistory();

    const resetEnrollmentId = (pageToPush: string = '') => {
        const { programId, orgUnitId, teiId } = getUrlQueries();
        history.push(
            `/${pageToPush}?${urlArguments({ programId, orgUnitId, teiId })}`,
        );
    };

    return { resetEnrollmentId };
};
