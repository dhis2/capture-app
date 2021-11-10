// @flow
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { urlArguments, getUrlQueries } from '../../../utils/url';

export const useResetTeiId = () => {
    const history = useHistory();
    const pathname: string = useSelector(({ router: { location } }) => location.pathname);

    const resetTeiId = (pageToPush: string = pathname) => {
        const { programId, orgUnitId } = getUrlQueries();
        history.push(`${pageToPush}?${urlArguments({ programId, orgUnitId })}`);
    };

    return { resetTeiId };
};
