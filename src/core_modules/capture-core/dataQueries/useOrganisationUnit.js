// @flow
import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { useSelector } from 'react-redux';
import log from 'loglevel';
import { errorCreator } from '../../capture-core-utils';


export const useOrganisationUnit = (orgUnitId: string, fields: string) => {
    const [orgUnit, setOrgUnit] = useState();
    const cachedOrganisationUnits = useSelector(({ organisationUnits }) => organisationUnits);
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
        if (!cachedOrganisationUnits || !cachedOrganisationUnits[orgUnitId]) {
            refetch({ variables: { orgUnitId } });
        }
    }, [refetch, orgUnitId, cachedOrganisationUnits]);

    useEffect(() => {
        if (error) {
            log.error(errorCreator('could not retrieve organisation unit name')({ error }));
        }
    }, [error]);

    useEffect(() => {
        if (cachedOrganisationUnits && cachedOrganisationUnits[orgUnitId]) {
            setOrgUnit({
                id: orgUnitId,
                name: cachedOrganisationUnits[orgUnitId].name,
                code: cachedOrganisationUnits[orgUnitId].code,
            });
        } else {
            setOrgUnit(
                (loading || !called || error) ?
                    undefined : {
                        id: orgUnitId,
                        name: data?.organisationUnits?.displayName,
                        code: data?.organisationUnits?.code,
                        ...data?.organisationUnits,
                    },
            );
        }
    }, [orgUnitId, data, loading, called, error, cachedOrganisationUnits]);

    return {
        error,
        orgUnit,
    };
};
