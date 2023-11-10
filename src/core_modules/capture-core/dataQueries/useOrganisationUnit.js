// @flow
import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import log from 'loglevel';
import { errorCreator } from '../../capture-core-utils';

// Skips fetching if orgUnitId is falsy
export const useOrganisationUnit = (orgUnitId: string, fields?: string): {
    orgUnit: any,
    error: any,
} => {
    const [orgUnit, setOrgUnit] = useState();
    const [requestedOrgUnitId, setRequestedOrgUnitId] = useState();
    const [fetchingInProgress, setFetchingInProgress] = useState(false);
    const { error, data, loading, refetch } = useDataQuery(
        useMemo(
            () => ({
                organisationUnits: {
                    resource: 'organisationUnits',
                    id: ({ variables: { orgUnitId: id } }) => id,
                    params: {
                        fields,
                    },
                },
            }),
            [fields],
        ), {
            lazy: true,
        },
    );

    useEffect(() => {
        if (!fetchingInProgress && orgUnitId && orgUnitId !== requestedOrgUnitId) {
            setFetchingInProgress(true);
            setRequestedOrgUnitId(orgUnitId);
            setOrgUnit(undefined);
            refetch({ variables: { orgUnitId } });
        }
    }, [fetchingInProgress, orgUnitId, requestedOrgUnitId, setFetchingInProgress, setRequestedOrgUnitId, refetch]);

    useEffect(() => {
        if (error) {
            log.error(errorCreator('could not retrieve organisation unit name')({ error }));
        }
    }, [error]);

    useEffect(() => {
        if (fetchingInProgress && !loading) {
            setFetchingInProgress(false);
            if (orgUnitId === requestedOrgUnitId && !error) {
                setOrgUnit({
                    id: orgUnitId,
                    ...data.organisationUnits,
                });
            }
        }
    }, [data, loading, error, fetchingInProgress, setFetchingInProgress, orgUnitId, requestedOrgUnitId]);

    return (orgUnitId && orgUnitId === requestedOrgUnitId) ? {
        error,
        orgUnit,
    } : {};
};
