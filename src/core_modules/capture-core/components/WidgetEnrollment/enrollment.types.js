// @flow
import type { FetchError, QueryRefetchFunction } from '@dhis2/app-runtime';

export type Props = {|
    teiId: string,
    enrollmentId: string,
    programId: string,
    callbackDelete: () => void,
|};

export type PlainProps = {|
    enrollment: Object,
    program: Object,
    ownerOrgUnit: Object,
    refetch: QueryRefetchFunction,
    error?: FetchError,
    loading: boolean,
    callbackDelete: () => void,
    ...CssClasses,
|};
