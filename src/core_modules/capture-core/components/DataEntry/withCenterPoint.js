// @flow
import React, { type ComponentType, useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const convertToClientCoordinates = ({ coordinates, type }: { coordinates: any[], type: string }) => {
    switch (type) {
    case 'Point':
        return [coordinates[1], coordinates[0]];
    case 'Polygon':
        return coordinates[0][0];
    default:
        return undefined;
    }
};

const getCenterPoint = (InnerComponent: ComponentType<any>) => (props: Object) => {
    const { orgUnit, ...passOnProps } = props;

    const { data, refetch, called } = useDataQuery(
        useMemo(
            () => ({
                organisationUnits: {
                    resource: 'organisationUnits',
                    id: ({ variables: { orgUnitId: id } }) => id,
                    params: { fields: ['geometry,parent'] },
                },
            }),
            [],
        ),
        { lazy: true },
    );
    if (orgUnit && !called) {
        refetch({ variables: { orgUnitId: orgUnit.id } });
    }
    const center = useMemo(() => {
        if (data?.organisationUnits) {
            const { geometry, parent } = data.organisationUnits;
            if (geometry) {
                return convertToClientCoordinates(geometry);
            } else if (parent?.id) {
                refetch({ variables: { orgUnitId: parent.id } });
            }
            return undefined;
        }
        return undefined;
    }, [data, refetch]);

    return <InnerComponent {...passOnProps} center={center || passOnProps.center} />;
};

export const withCenterPoint = () => (InnerComponent: ComponentType<any>) => getCenterPoint(InnerComponent);
