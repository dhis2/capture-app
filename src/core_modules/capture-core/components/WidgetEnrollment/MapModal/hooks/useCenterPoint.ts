import { useMemo, useState } from 'react';
import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';

const DEFAULT_CENTER: [number, number] = [51.505, -0.09];

type GeometryData = {
    coordinates: any[];
    type: string;
};

type OrgUnitData = {
    geometry?: GeometryData;
    parent?: {
        id: string;
    };
};

const convertToClientCoordinates = ({ coordinates, type }: GeometryData): [number, number] => {
    switch (type) {
    case 'Point':
        return [coordinates[1], coordinates[0]];
    case 'Polygon':
        return coordinates[0][0];
    default:
        return DEFAULT_CENTER;
    }
};

export const useCenterPoint = (orgUnitId: string, storedCenter: [number, number] | null | undefined) => {
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
    const { data, isInitialLoading } = useApiMetadataQuery(queryKey, queryFn, queryOptions);

    const center = useMemo(() => {
        if (data) {
            const { geometry, parent } = data as OrgUnitData;
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
        loading: isInitialLoading,
    };
};
