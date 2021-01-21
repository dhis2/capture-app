// @flow
import type { ResourceQuery, QueryVariables } from '@dhis2/app-runtime';

export type QuerySingleResource =
    (resourceQuery: ResourceQuery, variables?: QueryVariables) => Promise<any>;
