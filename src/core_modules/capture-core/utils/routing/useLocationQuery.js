// @flow
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export const useLocationQuery = (): { [key: string]: string } => {
    const search = useLocation().search;
    return useMemo(() => [...new URLSearchParams(search).entries()].reduce((accParams, entry) => {
        accParams[entry[0]] = entry[1];
        return accParams;
    }, {}), [search]);
};
