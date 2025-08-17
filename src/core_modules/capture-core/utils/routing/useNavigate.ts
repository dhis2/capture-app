import { useHistory } from 'react-router-dom';

export const useNavigate = () => {
    const history = useHistory();

    const navigate = (path: string, scrollToTop = true) => {
        history.push(path);
        if (scrollToTop) {
            window.scrollTo(0, 0);
        }
    };

    return { navigate };
};
