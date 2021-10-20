// @flow
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useSetEnrollmentId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const setEnrollmentId = (enrollmentId: string, pageToPush: string = pathname) => {
        const { programId, orgUnitId, teiId } = getUrlQueries();
        history.push(
            `${pageToPush}?${urlArguments({
                programId,
                orgUnitId,
                teiId,
                enrollmentId,
            })}`,
        );
    };

    return { setEnrollmentId };
};
