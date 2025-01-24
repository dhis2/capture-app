// @flow
import React, { type ComponentType, useMemo, useState } from 'react';
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

const getCenterPoint = (InnerComponent: ComponentType<any>) => (props: Object) => {
    const { orgUnit, ...passOnProps } = props;
    const [orgUnitKey, setOrgUnitKey] = useState(orgUnit.id);
    const [shouldFetch, setShouldFetch] = useState(false);
    const queryKey = ['organisationUnit', 'geometry', orgUnitKey];
    const queryFn = {
        resource: 'organisationUnits',
        id: () => orgUnitKey,
        params: {
            fields: 'geometry,parent',
        },
    };
    const queryOptions = useMemo(
        () => ({ enabled: Boolean(orgUnit.id) && shouldFetch }),
        [shouldFetch, orgUnit.id],
    );
    const { data } = useApiMetadataQuery<any>(queryKey, queryFn, queryOptions);

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

    const onOpenMap = (hasValue) => {
        setShouldFetch(!hasValue);
    };

    return <InnerComponent {...passOnProps} center={center} onOpenMap={onOpenMap} />;
};

export const withCenterPoint = () => (InnerComponent: ComponentType<any>) => getCenterPoint(InnerComponent);
