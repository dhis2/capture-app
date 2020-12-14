// @flow
import type { ResourceQuery, QueryVariables } from '@dhis2/app-runtime';

export type SingleResourceQuery =
    (resourceQuery: ResourceQuery, variables?: QueryVariables) => Promise<any>;
