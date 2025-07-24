import React, { useMemo, useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { ceil } from 'lodash/fp';
import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';

type Props = {
    orgUnitId: string | null;
};

const DEFAULT_CENTER = [51.505, -0.09];

const convertToClientCoordinates = ({ coordinates, type }: { coordinates: any[], type: string }) => {
    switch (type) {
    case 'Point':
        return [coordinates[1], coordinates[0]];
    case 'Polygon': {
        // Calculate a center point by finding the min and max values for longitude and latitude
        // and getting the mean of those values
        const { minLatitude, maxLatitude, minLongitude, maxLongitude } = coordinates[0]
            .reduce((accExtremes, [iLongitude, iLatitude]) => {
                if (iLatitude > accExtremes.maxLatitude) {
                    accExtremes.maxLatitude = iLatitude;
                } else if (iLatitude < accExtremes.minLatitude) {
                    accExtremes.minLatitude = iLatitude;
                }

                if (iLongitude > accExtremes.maxLongitude) {
                    accExtremes.maxLongitude = iLongitude;
                } else if (iLongitude < accExtremes.minLongitude) {
                    accExtremes.minLongitude = iLongitude;
                }

                return accExtremes;
            }, {
                minLatitude: coordinates[0][0][1],
                maxLatitude: coordinates[0][0][1],
                minLongitude: coordinates[0][0][0],
                maxLongitude: coordinates[0][0][0],
            });

        const latitude = ceil((maxLatitude + minLatitude) / 2, 6);
        const longitude = ceil((maxLongitude + minLongitude) / 2, 6);

        return [latitude, longitude];
    }
    default:
        return DEFAULT_CENTER;
    }
};

const getCenterPoint = (InnerComponent: ComponentType<any>) => ({ orgUnitId, ...passOnProps }: Props) => {
    const [orgUnitFetchId, setOrgUnitFetchId] = useState(orgUnitId);
    const [fetchEnabled, setFetchEnabled] = useState(false);

    useEffect(() => {
        setOrgUnitFetchId(orgUnitId);
    }, [orgUnitId]);

    const queryKey = ['organisationUnit', 'geometry', orgUnitFetchId];
    const queryFn = {
        resource: 'organisationUnits',
        id: () => orgUnitFetchId,
        params: {
            fields: 'geometry,parent',
        },
    };
    const queryOptions = useMemo(
        () => ({ enabled: Boolean(orgUnitFetchId) && fetchEnabled }),
        [fetchEnabled, orgUnitFetchId],
    );

    const { data }: any = useApiMetadataQuery(queryKey, queryFn, queryOptions);

    useEffect(() => {
        if (data?.parent && !data?.geometry) {
            setOrgUnitFetchId(data.parent.id);
        }
    }, [data]);

    const center = useMemo(() => {
        if (!orgUnitFetchId) {
            return DEFAULT_CENTER;
        }
        if (data) {
            if (data.geometry) {
                return convertToClientCoordinates(data.geometry);
            }
            if (data.parent) {
                return null;
            }
            return DEFAULT_CENTER;
        }
        return null;
    }, [data, orgUnitFetchId]);

    const onOpenMap = (hasValue) => {
        setFetchEnabled(!hasValue);
    };

    const onCloseMap = () => {
        setFetchEnabled(false);
    };

    return (
        <InnerComponent
            {...passOnProps}
            center={center}
            onOpenMap={onOpenMap}
            onCloseMap={onCloseMap}
        />
    );
};

export const withCenterPoint = () => (InnerComponent: ComponentType<any>) => getCenterPoint(InnerComponent);
