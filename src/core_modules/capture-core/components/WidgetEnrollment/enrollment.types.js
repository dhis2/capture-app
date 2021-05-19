// @flow
import type { FetchError, QueryRefetchFunction } from '@dhis2/app-runtime';

export type Props = {|
    enrollment: Object,
    program: Object,
    ownerOrgUnit: Object,
    refetch: QueryRefetchFunction,
    error?: FetchError,
    loading: boolean,
    callbackDelete: () => void,
    ...CssClasses,
|};
