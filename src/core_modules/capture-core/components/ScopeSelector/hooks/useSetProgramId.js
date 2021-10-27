// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useSetProgramId = () => {
    const history = useHistory();
    const { pathname }: string = useLocation();

    const setProgramId = (programId: string, pageToPush: string = pathname) => {
        const restOfQueries = getUrlQueries();
        history.push(`${pageToPush}?${urlArguments({ ...restOfQueries, programId })}`);
    };

    return { setProgramId };
};
