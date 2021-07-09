// @flow
import { useHistory } from 'react-router';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useResetProgramId = () => {
    const history = useHistory();

    const resetProgramId = (pageToPush: string = '') => {
        const { programId, ...restOfQueries } = getUrlQueries();
        history.push(`/${pageToPush}?${urlArguments({ ...restOfQueries })}`);
    };

    return { resetProgramId };
};
