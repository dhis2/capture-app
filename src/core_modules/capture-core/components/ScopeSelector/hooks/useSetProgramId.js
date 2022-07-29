// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';

export const useSetProgramId = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const restOfQueries = useLocationQuery();


    const setProgramId = (programId: string, pageToPush: string = pathname) => {
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries, programId })}`);
    };

    return { setProgramId };
};
