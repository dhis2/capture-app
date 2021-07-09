// @flow
import { useHistory } from 'react-router';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useSetProgramId = () => {
    const history = useHistory();

    const setProgramId = (pageToPush: string = '', programId: string) => {
        const restOfQueries = getUrlQueries();
        history.push(
            `/${pageToPush}?${urlArguments({ ...restOfQueries, programId })}`,
        );
    };

    return { setProgramId };
};
