// @flow
import { useLocation } from 'react-router-dom';

export const useFallbackTriggered = (): boolean => {
    const defaultValue = { fallback: false };
    const { state: { fallback } = defaultValue } = useLocation();

    return fallback;
};
