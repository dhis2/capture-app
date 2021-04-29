// @flow
import React, { useMemo, type ComponentType } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type Props = {
    ownerOrgUnit: string,
};

export const withOrganizationUnit = (Component: ComponentType) => (props: Props) => {
    const organisationUnitsQuery = useMemo(
        () => ({
            organisationUnits: {
                resource: `organisationUnits/${props.ownerOrgUnit}`,
                params: {
                    fields: ['displayName'],
                },
            },
        }),
        [props.ownerOrgUnit],
    );
    const organisationUnitsFetch = useDataQuery(organisationUnitsQuery);

    if (organisationUnitsFetch.error) {
        throw organisationUnitsFetch.error;
    }

    return organisationUnitsFetch.data &&
        organisationUnitsFetch.data.organisationUnits &&
        organisationUnitsFetch.data.organisationUnits.displayName ? (
            <Component
                {...props}
                ownerOrgUnit={{
                    ...props.ownerOrgUnit,
                    displayName: organisationUnitsFetch.data.organisationUnits.displayName,
                }}
            />
        ) : (
            <> </>
        );
};
