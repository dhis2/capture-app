import type { useDataQuery, useDataEngine } from '@dhis2/app-runtime';

type DataEngine = ReturnType<typeof useDataEngine>;
export type Mutation = Parameters<DataEngine['mutate']>[0];
export type QueryResponse = ReturnType<typeof useDataQuery>;
export type QueryRefetchFunction = QueryResponse['refetch'];
