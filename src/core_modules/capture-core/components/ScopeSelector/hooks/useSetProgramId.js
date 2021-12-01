// @flow
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { buildUrlQueryString } from '../../../utils/routing';
import { getUrlQueries } from '../../../utils/url';

export const useSetProgramId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const setProgramId = (programId: string, pageToPush: string = pathname) => {
        const restOfQueries = getUrlQueries();
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries, programId })}`);
    };

    return { setProgramId };
};
