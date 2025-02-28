// @flow
import { useNavigate } from 'capture-core/utils/routing';

export const useReset = () => {
    const { navigate } = useNavigate();

    const reset = () => {
        navigate('/');
    };

    return { reset };
};
