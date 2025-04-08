import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { fetchOrgUnit } from './OrgUnitFetcher.actions';
import type { OrgUnitFetcherProps } from './OrgUnitFetcher.types';

export const OrgUnitFetcher = ({ orgUnitId, children, error }: OrgUnitFetcherProps) => {
    const dispatch = useDispatch();
    const orgUnit = useSelector(({ organisationUnits }: { organisationUnits: Record<string, any> }) => 
        organisationUnits[orgUnitId]
    );

    useEffect(() => {
        if (!orgUnit && orgUnitId) {
            dispatch(fetchOrgUnit(orgUnitId));
        }
    }, [orgUnitId, orgUnit, dispatch]);

    return orgUnit || !orgUnitId || error ? children : <LoadingMaskElementCenter />;
};
