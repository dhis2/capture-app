import type { useDataQuery, useDataEngine } from '@dhis2/app-runtime';

type DataEngine = ReturnType<typeof useDataEngine>;
export type Mutation = Parameters<DataEngine['mutate']>[0];
export type QueryResponse = ReturnType<typeof useDataQuery>;
export type QueryRefetchFunction = QueryResponse['refetch'];
export type QueryParameters = {
    pageSize?: number
    page?: number
    fields?: string | string[]
    filter?: string | string[]
}
export type QueryVariables = any;

export type ResourceQuery = {
    resource: string
    id?: string
    data?: any
    params?: any
};

