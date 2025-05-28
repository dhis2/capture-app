import type { useDataQuery } from '@dhis2/app-runtime';

export type QueryResponse = ReturnType<typeof useDataQuery>;
export type QueryRefetchFunction = QueryResponse['refetch'];
