// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const fields =
    'id,displayName,displayShortName,displayFormName,description,valueType,optionSetValue,unique,orgunitScope,' +
    'pattern,translations[property,locale,value],optionSet[id]';

export const useTrackedEntityAttributes = () => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityAttributes: {
                    resource: 'trackedEntityAttributes',
                    params: {
                        fields,
                    },
                },
            }),
            [],
        ),
    );
    return { error, loading, trackedEntityAttributes: !loading && data?.trackedEntityAttributes?.trackedEntityAttributes };
};
