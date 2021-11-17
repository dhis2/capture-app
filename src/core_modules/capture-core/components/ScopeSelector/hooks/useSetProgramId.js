// @flow
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';

export const useSetProgramId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const setProgramId = (programId: string, pageToPush: string = pathname) => {
        const restOfQueries = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries, programId })}`);
    };

    return { setProgramId };
};
