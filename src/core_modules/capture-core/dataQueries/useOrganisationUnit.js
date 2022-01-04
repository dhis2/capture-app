// @flow
import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import log from 'loglevel';
import { useOrgUnitGroups } from 'capture-core/hooks/useOrgUnitGroups';
import { errorCreator } from '../../capture-core-utils';

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

    const groups = useOrgUnitGroups(orgUnitId);

    useEffect(() => {
        refetch({ variables: { orgUnitId } });
    }, [refetch, orgUnitId]);

    useEffect(() => {
        if (error) {
            log.error(errorCreator('could not retrieve organisation unit name')({ error }));
        }
    }, [error]);

    useEffect(() => {
        setOrgUnit(
            (loading || !called || error || !groups) ?
                undefined : {
                    id: orgUnitId,
                    name: data?.organisationUnits?.displayName,
                    code: data?.organisationUnits?.code,
                    groups,
                    ...data,
                },
        );
    }, [orgUnitId, groups, data, loading, called, error]);

    return {
        error,
        orgUnit,
    };
};
