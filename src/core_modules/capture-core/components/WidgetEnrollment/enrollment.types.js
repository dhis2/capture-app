// @flow
import type { FetchError, QueryRefetchFunction } from '@dhis2/app-runtime';

export type Props = {|
    teiId: string,
    enrollmentId: string,
    programId: string,
    onDelete: () => void,
    onAddNew: () => void,
|};

export type PlainProps = {|
    enrollment: Object,
    program: Object,
    ownerOrgUnit: Object,
    refetch: QueryRefetchFunction,
    error?: FetchError,
    loading: boolean,
    canAddNew: boolean,
    onDelete: () => void,
    onAddNew: () => void,
    ...CssClasses,
|};
