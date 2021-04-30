// @flow
import React, { useMemo, type ComponentType } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type Props = {
    programId: string,
    teiId: string,
};

export const withTrackedEntityInstances = (Component: ComponentType<any>) => (
    props: Props
) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstances: {
                    resource: `trackedEntityInstances/${props.teiId}`,
                    params: {
                        fields: ['programOwners[ownerOrgUnit]'],
                        program: [props.programId],
                    },
                },
            }),
            [props.teiId, props.programId]
        )
    );

    if (error) {
        throw error;
    }

    return !loading &&
        data &&
        data.trackedEntityInstances &&
        data.trackedEntityInstances.programOwners &&
        data.trackedEntityInstances.programOwners[0] &&
        data.trackedEntityInstances.programOwners[0].ownerOrgUnit ? (
        <Component
            {...props}
            ownerOrgUnit={
                data.trackedEntityInstances.programOwners[0].ownerOrgUnit
            }
        />
    ) : (
        <></>
    );
};
