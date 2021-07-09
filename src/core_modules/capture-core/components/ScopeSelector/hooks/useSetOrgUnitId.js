// @flow
import { useHistory } from 'react-router';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useSetOrgUnitId = () => {
    const history = useHistory();

    const setOrgUnitId = (pageToPush: string = '', orgUnitId: string) => {
        const restOfQueries = getUrlQueries();
        history.push(
            `/${pageToPush}?${urlArguments({ ...restOfQueries, orgUnitId })}`,
        );
    };

    return { setOrgUnitId };
};
