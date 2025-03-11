// @flow
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useLocationQuery = (): { [key: string]: string } => {
    const search = useLocation().search;
    return useMemo(() => [...new URLSearchParams(search).entries()].reduce((accParams, entry) => {
        accParams[entry[0]] = entry[1];
        return accParams;
    }, {}), [search]);
};
