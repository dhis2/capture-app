// @flow
import React, { useMemo, type ComponentType } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type Props = {
    programId: string,
    teiId: string,
};

export const withTrackedEntityInstances = (Component: ComponentType) => (props: Props) => {
    const trackedEntityInstancesQuery = useMemo(
        () => ({
            trackedEntityInstances: {
                resource: `trackedEntityInstances/${props.teiId}`,
                params: {
                    fields: ['programOwners[ownerOrgUnit]'],
                    program: [props.programId],
                },
            },
        }),
        [props.teiId, props.programId],
    );

    const trackedEntityInstancesFetch = useDataQuery(trackedEntityInstancesQuery);

    if (trackedEntityInstancesFetch.error) {
        throw trackedEntityInstancesFetch.error;
    }

    return trackedEntityInstancesFetch.data &&
        trackedEntityInstancesFetch.data.trackedEntityInstances &&
        trackedEntityInstancesFetch.data.trackedEntityInstances.programOwners &&
        trackedEntityInstancesFetch.data.trackedEntityInstances.programOwners[0] &&
        trackedEntityInstancesFetch.data.trackedEntityInstances.programOwners[0].ownerOrgUnit ? (
            <Component
                {...props}
                ownerOrgUnit={trackedEntityInstancesFetch.data.trackedEntityInstances.programOwners[0].ownerOrgUnit}
            />
        ) : (
            <></>
        );
};
