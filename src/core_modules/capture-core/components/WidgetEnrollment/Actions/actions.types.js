// @flow
import type { QueryRefetchFunction } from '@dhis2/app-runtime';
import type { UpdateEnrollmentOwnership } from './Transfer/hooks/useUpdateOwnership';

export type Props = {|
    enrollment: Object,
    events: Array<{ status: string, event: string, programStage: string }>,
    programStages: Array<{ name: string, id: string, access: { data: { write: boolean } } }>,
    refetchEnrollment: QueryRefetchFunction,
    refetchTEI: QueryRefetchFunction,
    ownerOrgUnitId: string,
    onDelete: () => void,
    onAddNew: () => void,
    onUpdateEnrollmentStatus?: (enrollment: Object) => void,
    onUpdateEnrollmentStatusSuccess?: ({ redirect?: boolean }) => void,
    onUpdateEnrollmentStatusError?: (message: string) => void,
    onError?: (message: string) => void,
    onSuccess?: () => void,
    canAddNew: boolean,
    onlyEnrollOnce: boolean,
    tetName: string,
    onAccessLostFromTransfer?: () => void,
|};

export type PlainProps = {|
    enrollment: Object,
    events: Array<{ status: string, event: string, programStage: string }>,
    programStages: Array<{ name: string, id: string, access: { data: { write: boolean } } }>,
    ownerOrgUnitId: string,
    onUpdate: (arg: Object) => void,
    onUpdateStatus: (arg: Object, redirect?: boolean) => void,
    onDelete: (arg: Object) => void,
    onAddNew: (arg: Object) => void,
    onUpdateOwnership: UpdateEnrollmentOwnership,
    isTransferLoading: boolean,
    loading: boolean,
    canAddNew: boolean,
    onlyEnrollOnce: boolean,
    tetName: string,
    ...CssClasses,
|};

