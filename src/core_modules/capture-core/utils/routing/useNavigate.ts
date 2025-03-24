import { useHistory } from 'react-router-dom';

type NavigateFunction = (path: string, scrollToTop?: boolean) => void;

export const useNavigate = (): { navigate: NavigateFunction } => {
    const history = useHistory();

    const navigate: NavigateFunction = (path, scrollToTop = true) => {
        history.push(path);
        if (scrollToTop) {
            window.scrollTo(0, 0);
        }
    };

    return { navigate };
};
