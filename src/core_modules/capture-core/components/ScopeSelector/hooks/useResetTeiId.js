// @flow
import { useHistory } from 'react-router';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useResetTeiId = () => {
    const history = useHistory();

    const resetTeiId = (pageToPush: string = '') => {
        const { programId, orgUnitId } = getUrlQueries();
        history.push(
            `/${pageToPush}?${urlArguments({ programId, orgUnitId })}`,
        );
    };

    return { resetTeiId };
};
