// @flow
import { withErrorMessageHandler } from 'capture-core/HOC';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { fetchOrgUnit } from './OrgUnitFetcher.actions';

export const OrgUnitFetcher = withErrorMessageHandler()(({ orgUnitId, children }: Object) => {
    const dispatch = useDispatch();
    const { orgUnit } = useSelector(
        ({
            organisationUnits,
        }) => ({
            orgUnit: organisationUnits[orgUnitId],
        }),
    );

    useEffect(() => {
        if (!orgUnit && orgUnitId) {
            dispatch(fetchOrgUnit(orgUnitId));
        }
    }, [orgUnitId, orgUnit, dispatch]);

    return orgUnit || !orgUnitId ? children : <LoadingMaskElementCenter />;
});
