// @flow
import { useHistory } from 'react-router';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useSetEnrollmentId = () => {
    const history = useHistory();

    const setEnrollmentId = (pageToPush: string = '', enrollmentId: string) => {
        const { programId, orgUnitId, teiId } = getUrlQueries();
        history.push(
            `/${pageToPush}?${urlArguments({
                programId,
                orgUnitId,
                teiId,
                enrollmentId,
            })}`,
        );
    };

    return { setEnrollmentId };
};
