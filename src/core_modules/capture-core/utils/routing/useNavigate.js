// @flow
import { useHistory } from 'react-router-dom';

export const useNavigate = () => {
    const history = useHistory();

    const navigate = (path: string, scrollToTop: boolean = true) =>
        history
            .push(path)
            .then(() => {
                if (scrollToTop) {
                    window.scrollTo(0, 0);
                }
            });

    return { navigate };
};

