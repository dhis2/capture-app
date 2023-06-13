// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const DEFAULT_CENTER = [51.505, -0.09];

const convertToClientCoordinates = ({ coordinates, type }: { coordinates: any[], type: string }) => {
    switch (type) {
    case 'Point':
        return [coordinates[1], coordinates[0]];
    case 'Polygon':
        return coordinates[0][0];
    default:
        return DEFAULT_CENTER;
    }
};

export const useCenterPoint = (orgUnitId: string | boolean) => {
    const { error, loading, data, refetch, called } = useDataQuery(
        useMemo(
            () => ({
                organisationUnits: {
                    resource: 'organisationUnits',
                    id: ({ variables: { orgUnitId: id } }) => id,
                    params: {
                        fields: ['geometry,parent'],
                    },
                },
            }),
            [],
        ),
        { lazy: true },
    );

    if (orgUnitId && !called) {
        refetch({ variables: { orgUnitId } });
    }

    const center = useMemo(() => {
        if (!error && data?.organisationUnits) {
            const { geometry, parent } = data.organisationUnits;
            if (geometry) {
                return convertToClientCoordinates(geometry);
            } else if (parent?.id) {
                refetch({ variables: { orgUnitId: parent.id } });
            }
            return DEFAULT_CENTER;
        }
        return undefined;
    }, [data, refetch, error]);

    return {
        center,
        loading,
    };
};
