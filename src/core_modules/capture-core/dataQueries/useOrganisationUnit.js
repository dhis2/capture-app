// @flow
import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import log from 'loglevel';
import { errorCreator } from '../../capture-core-utils';

// Skips fetching if orgUnitId is falsy
export const useOrganisationUnit = (orgUnitId: string, fields?: string) => {
    const [orgUnit, setOrgUnit] = useState();
    const { error, loading, data, refetch, called } = useDataQuery(
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
        orgUnitId && refetch({ variables: { orgUnitId } });
    }, [refetch, orgUnitId]);

    useEffect(() => {
        if (error) {
            log.error(errorCreator('could not retrieve organisation unit name')({ error }));
        }
    }, [error]);

    useEffect(() => {
        const organisationUnit = data?.organisationUnits;
        orgUnitId && setOrgUnit(
            (loading || !called || error) ?
                undefined : {
                    id: orgUnitId,
                    name: organisationUnit?.displayName,
                    code: organisationUnit?.code,
                    ...organisationUnit,
                },
        );
    }, [orgUnitId, data, loading, called, error]);

    return {
        error,
        orgUnit,
    };
};
