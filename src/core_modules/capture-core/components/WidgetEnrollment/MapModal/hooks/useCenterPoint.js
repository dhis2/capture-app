// @flow
import { useMemo, useState } from 'react';
import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';

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

export const useCenterPoint = (orgUnitId: string, storedCenter: ?[number, number]) => {
    const [orgUnitKey, setOrgUnitKey] = useState(orgUnitId);
    const queryKey = ['organisationUnit', 'geometry', orgUnitKey];
    const queryFn = {
        resource: 'organisationUnits',
        id: () => orgUnitKey,
        params: {
            fields: 'geometry,parent',
        },
    };
    const queryOptions = { enabled: !storedCenter && Boolean(orgUnitId) };
    const { data, isLoading } = useApiMetadataQuery<any>(queryKey, queryFn, queryOptions);

    const center = useMemo(() => {
        if (data) {
            const { geometry, parent } = data;
            if (geometry) {
                return convertToClientCoordinates(geometry);
            } else if (parent?.id) {
                setOrgUnitKey(parent.id);
            }
            return DEFAULT_CENTER;
        }
        return undefined;
    }, [data]);

    if (storedCenter) {
        return {
            center: storedCenter,
        };
    }

    return {
        center,
        loading: isLoading,
    };
};
