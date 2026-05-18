import { useCallback, useMemo, useState } from 'react';

const WINDOWING_THRESHOLD = 200;
const WINDOW_PAGE_SIZE = 100;

type UseWindowedOptionsResult<T> = {
    visibleOptions: T[];
    onEndReached: () => void;
    resetWindow: () => void;
};

export const useWindowedOptions = <T>(options: T[]): UseWindowedOptionsResult<T> => {
    const [visibleCount, setVisibleCount] = useState(WINDOW_PAGE_SIZE);
    const enabled = options.length > WINDOWING_THRESHOLD;

    const visibleOptions = useMemo(
        () => (enabled ? options.slice(0, visibleCount) : options),
        [enabled, options, visibleCount],
    );

    const onEndReached = useCallback(() => {
        setVisibleCount(current => Math.min(current + WINDOW_PAGE_SIZE, options.length));
    }, [options.length]);

    const resetWindow = useCallback(() => {
        setVisibleCount(WINDOW_PAGE_SIZE);
    }, []);

    return { visibleOptions, onEndReached, resetWindow };
};
