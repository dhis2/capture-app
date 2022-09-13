// @flow
import React, { type ComponentType, useMemo } from 'react';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';

export const withApiUtils = (InnerComponent: ComponentType<any>) => (props: any) => {
    const dataEngine = useDataEngine();
    const { querySingleResource, mutate } = useMemo(
        () => ({
            querySingleResource: makeQuerySingleResource(dataEngine.query.bind(dataEngine)),
            mutate: dataEngine.mutate.bind(dataEngine),
        }),
        [dataEngine],
    );

    return <InnerComponent {...props} querySingleResource={querySingleResource} mutate={mutate} />;
};
