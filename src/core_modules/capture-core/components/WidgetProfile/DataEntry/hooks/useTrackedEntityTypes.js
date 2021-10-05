// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const fields =
    'id,access,displayName,minAttributesRequiredToSearch,featureType,' +
    'trackedEntityTypeAttributes[trackedEntityAttribute[id],displayInList,mandatory,searchable],' +
    'translations[property,locale,value]';

export const useTrackedEntityTypes = () => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityTypes: {
                    resource: 'trackedEntityTypes',
                    params: {
                        fields,
                    },
                },
            }),
            [],
        ),
    );

    return { error, loading, trackedEntityTypes: !loading && data?.trackedEntityTypes?.trackedEntityTypes };
};
