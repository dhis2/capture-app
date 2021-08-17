// @flow
import { useHistory } from 'react-router';

export const useReset = () => {
    const history = useHistory();

    const reset = () => {
        history.push('/');
    };

    return { reset };
};
