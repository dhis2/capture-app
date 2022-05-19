// @flow
import { useHistory, useLocation } from 'react-router-dom';
import { buildUrlQueryString } from '../../../utils/routing';
import type { Url } from '../../../utils/url';

export const useResetViewEventId = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const resetViewEventId = (pageToPush: string = pathname, restOfQueries: Url = {}) => {
        history.push(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    return { resetViewEventId };
};
