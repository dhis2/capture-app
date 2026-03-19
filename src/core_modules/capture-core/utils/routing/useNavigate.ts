import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export const useNavigate = () => {
    const history = useHistory();

    const navigate = useCallback((path: string, scrollToTop = true) => {
        history.push(path);
        if (scrollToTop) {
            window.scrollTo(0, 0);
        }
    }, [history]);

    return { navigate };
};
