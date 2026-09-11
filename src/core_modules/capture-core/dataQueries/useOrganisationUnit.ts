import { useMemo, useEffect, useState } from 'react';
import { useDataQuery, type FetchError } from '@dhis2/app-runtime';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';

type OrganisationUnit<TFields extends Record<string, unknown>> = TFields & {
    id: string,
};

type OrganisationUnitQueryResult<TFields extends Record<string, unknown>> = {
    organisationUnits: TFields,
};

type UseOrganisationUnitResult<TFields extends Record<string, unknown>> = {
    orgUnit?: OrganisationUnit<TFields>,
    error?: FetchError,
};

export const useOrganisationUnit = <TFields extends Record<string, unknown> = Record<string, unknown>>(
    orgUnitId: string | null | undefined,
    fields?: string,
): UseOrganisationUnitResult<TFields> => {
    const [orgUnit, setOrgUnit] = useState<OrganisationUnit<TFields>>();
    const [requestedOrgUnitId, setRequestedOrgUnitId] = useState<string>();
    const [fetchingInProgress, setFetchingInProgress] = useState(false);
    const { error, data, loading, refetch } = useDataQuery<OrganisationUnitQueryResult<TFields>>(
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
            if (orgUnitId && orgUnitId === requestedOrgUnitId && !error && data?.organisationUnits) {
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
    } : { orgUnit: undefined, error: undefined };
};
