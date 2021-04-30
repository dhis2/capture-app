// @flow
import React, { useMemo, type ComponentType } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type Props = {
    ownerOrgUnit: string,
};

export const withOrganizationUnit = (Component: ComponentType<any>) => (
    props: Props,
) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                organisationUnits: {
                    resource: `organisationUnits/${props.ownerOrgUnit}`,
                    params: {
                        fields: ['displayName'],
                    },
                },
            }),
            [props.ownerOrgUnit],
        ),
    );

    if (error) {
        throw error;
    }

    return !loading && data?.organisationUnits?.displayName ? (
        <Component
            {...props}
            ownerOrgUnit={{
                ...props.ownerOrgUnit,
                displayName: data.organisationUnits.displayName,
            }}
        />
    ) : (
        <> </>
    );
};
