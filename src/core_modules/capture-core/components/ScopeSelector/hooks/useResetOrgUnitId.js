// @flow
import { useHistory } from 'react-router';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useResetOrgUnitId = () => {
    const history = useHistory();

    const resetOrgUnitId = (pageToPush: string = '') => {
        const { orgUnitId, ...restOfQueries } = getUrlQueries();
        history.push(`/${pageToPush}?${urlArguments({ ...restOfQueries })}`);
    };

    return { resetOrgUnitId };
};
