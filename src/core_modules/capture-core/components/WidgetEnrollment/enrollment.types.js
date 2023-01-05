// @flow
import type { FetchError, QueryRefetchFunction } from '@dhis2/app-runtime';

export type Props = {|
    teiId: string,
    enrollmentId: string,
    programId: string,
    onDelete: () => void,
    onAddNew: () => void,
    onError?: (message: string) => void,
|};

export type PlainProps = {|
    enrollment: Object,
    program: Object,
    ownerOrgUnit: Object,
    refetchEnrollment: QueryRefetchFunction,
    refetchTEI: QueryRefetchFunction,
    error?: FetchError,
    loading: boolean,
    canAddNew: boolean,
    onDelete: () => void,
    onAddNew: () => void,
    onError?: (message: string) => void,
    serverTimeZoneId?: string,
    ...CssClasses,
|};
