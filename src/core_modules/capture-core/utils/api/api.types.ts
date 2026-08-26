import type { ResourceQuery, QueryVariables } from 'capture-core-utils/types/app-runtime';

export type QuerySingleResource =
    (resourceQuery: ResourceQuery, variables?: QueryVariables) => Promise<any>;
