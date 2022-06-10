// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';

export const useResetTeiId = () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { programId, orgUnitId } = useLocationQuery();


    const resetTeiId = (pageToPush: string = pathname) => {
        history.push(`${pageToPush}?${buildUrlQueryString({ programId, orgUnitId })}`);
    };

    return { resetTeiId };
};
