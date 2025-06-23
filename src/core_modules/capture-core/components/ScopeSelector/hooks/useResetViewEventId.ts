import { useLocation } from 'react-router-dom';
import { useNavigate, buildUrlQueryString } from '../../../utils/routing';

type Url = Record<string, string>;

export const useResetViewEventId = () => {
    const { navigate } = useNavigate();
    const { pathname } = useLocation();

    const resetViewEventId = (pageToPush: string = pathname, restOfQueries: Url = {}) => {
        navigate(`${pageToPush}?${buildUrlQueryString({ ...restOfQueries })}`);
    };

    return { resetViewEventId };
};
