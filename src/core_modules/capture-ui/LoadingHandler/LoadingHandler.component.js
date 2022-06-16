// @flow
import type { Props } from './loadingHandler.types';

export const LoadingHandler = ({ loading, children }: Props) => {
    if (loading) {
        return null;
    }

    return children;
};
