// @flow
import type { FetchError, QueryRefetchFunction } from '@dhis2/app-runtime';

export type Props = {|
    teiId: string,
    enrollmentId: string,
    programId: string,
    mayEditDate: boolean,
    onDelete: () => void,
    onAddNew: () => void,
    onUpdateDate?: (enrollmentDate: string) => void,
    onError?: (message: string) => void,
    onSuccess?: () => void,
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
    editDateEnabled: boolean,
    onDelete: () => void,
    onAddNew: () => void,
    onUpdateDate?: (enrollmentDate: string) => void,
    onError?: (message: string) => void,
    onSuccess?: () => void,
    ...CssClasses,
|};
