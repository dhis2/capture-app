// @flow
import type { QueryRefetchFunction } from '@dhis2/app-runtime';
import type { UpdateEnrollmentOwnership } from './Transfer/hooks/useUpdateOwnership';

export type Props = {|
    enrollment: Object,
    refetchEnrollment: QueryRefetchFunction,
    refetchTEI: QueryRefetchFunction,
    ownerOrgUnitId: string,
    onDelete: () => void,
    onAddNew: () => void,
    onError?: (message: string) => void,
    onSuccess?: () => void,
    canAddNew: boolean,
    onlyEnrollOnce: boolean,
    tetName: string,
    onTransferOutsideCaptureScope?: () => void,
|};

export type PlainProps = {|
    enrollment: Object,
    ownerOrgUnitId: string,
    onUpdate: (arg: Object) => void,
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

