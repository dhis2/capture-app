// @flow
import React, { type ComponentType, useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const getCenterPoint = (InnerComponent: ComponentType<any>) =>
    (props: Object) => {
        const {
            orgUnit,
            ...passOnProps
        } = props;

        const { data, refetch, called } = useDataQuery(useMemo(
            () => ({
                organisationUnits: {
                    resource: 'organisationUnits',
                    id: ({ variables: { orgUnitId: id } }) => id,
                    params: {
                        fields: ['geometry'],
                    },
                },
            }),
            [],
        ),
        {
            lazy: true,
        },
        );
        if (orgUnit && !called) {
            refetch({ variables: { orgUnitId: orgUnit.id } });
        }
        const center = useMemo(() => {
            if (data?.organisationUnits) {
                return [
                    data?.organisationUnits?.geometry?.coordinates?.[1],
                    data?.organisationUnits?.geometry?.coordinates?.[0],
                ];
            }
            return undefined;
        }, [data]);

        return (
            <InnerComponent
                {...passOnProps}
                center={center}
            />
        );
    };

export const withCenterPoint = () =>
    (InnerComponent: ComponentType<any>) =>
        getCenterPoint(InnerComponent);
