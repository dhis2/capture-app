// @flow
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useSetOrgUnitId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const setOrgUnitId = (orgUnitId: string, pageToPush: string = pathname, withRestOfQueries?: ?boolean = true) => {
        const restOfQueries = getUrlQueries();
        withRestOfQueries
            ? history.push(`${pageToPush}?${urlArguments({ ...restOfQueries, orgUnitId })}`)
            : history.push(`${pageToPush}?${urlArguments({ orgUnitId })}`);
    };

    return { setOrgUnitId };
};
