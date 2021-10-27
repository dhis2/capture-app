// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useResetTeiId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetTeiId = (pageToPush: string = pathname) => {
        const { programId, orgUnitId } = getUrlQueries();
        history.push(`${pageToPush}?${urlArguments({ programId, orgUnitId })}`);
    };

    return { resetTeiId };
};
