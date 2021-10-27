// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useResetOrgUnitId = () => {
    const history = useHistory();
    const { pathname }: string = useLocation();

    const resetOrgUnitId = (pageToPush: string = pathname) => {
        const { orgUnitId, ...restOfQueries } = getUrlQueries();
        history.push(`${pageToPush}?${urlArguments({ ...restOfQueries })}`);
    };

    return { resetOrgUnitId };
};
