import React from 'react';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';

export const withApiUtils = (InnerComponent: React.ComponentType<any>) => (props: any) => {
    const dataEngine = useDataEngine();
    const { querySingleResource, mutate } = React.useMemo(
        () => ({
            querySingleResource: makeQuerySingleResource(dataEngine.query.bind(dataEngine)),
            mutate: dataEngine.mutate.bind(dataEngine),
        }),
        [dataEngine],
    );

    return <InnerComponent {...props} querySingleResource={querySingleResource} mutate={mutate} />;
};
