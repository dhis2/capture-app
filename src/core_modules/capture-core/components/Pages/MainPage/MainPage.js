import React, { useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import { urlArguments } from '../../../utils/url';
import { MainPage as MainPageInner } from './MainPage.container';

const useLocationQuery = () => {
    const search = useLocation().search;
    return useMemo(() => [...new URLSearchParams(search).entries()].reduce((accParams, entry) => {
        accParams[entry[0]] = entry[1];
        return accParams;
    }, {}), [search]);
};

export const NewPageEnforcer = ({ children, newPageEnforced }) => {
    const { push } = useHistory();
    const { programId, orgUnitId } = useLocationQuery();
    useEffect(() => {
        if (newPageEnforced) {
            const queryArgs = urlArguments({ programId, orgUnitId });
            push(`/new?${queryArgs}`);
        }
    }, [push, orgUnitId, programId, newPageEnforced]);

    return newPageEnforced ? null : children;
};

export const MainPage = props => <NewPageEnforcer {...props}><MainPageInner /></NewPageEnforcer>;
