import type { QueryRefetchFunction } from '../enrollment.types';
import type { UpdateEnrollmentOwnership } from './Transfer/hooks/useUpdateOwnership';

export type Props = {
    enrollment: Record<string, unknown>;
    events: Array<{ status: string; event: string; programStage: string }>;
    programStages: Array<{ name: string; id: string; access: { data: { write: boolean } } }>;
    refetchEnrollment: QueryRefetchFunction;
    refetchTEI: QueryRefetchFunction;
    ownerOrgUnitId: string;
    onDelete: () => void;
    onAddNew: () => void;
    onUpdateEnrollmentStatus?: (enrollment: Record<string, unknown>) => void;
    onUpdateEnrollmentStatusSuccess?: (options: { redirect?: boolean }) => void;
    onUpdateEnrollmentStatusError?: (message: string) => void;
    onError?: (message: string) => void;
    onSuccess?: () => void;
    canAddNew: boolean;
    onlyEnrollOnce: boolean;
    tetName: string;
    onAccessLostFromTransfer?: () => void;
    onUpdate?: (arg: Record<string, unknown>) => void;
    onUpdateStatus?: (arg: Record<string, unknown>, redirect?: boolean) => void;
    canCascadeDeleteEnrollment?: boolean;
    loading?: boolean;
    isTransferLoading?: boolean;
    onUpdateOwnership?: any;
};

export type PlainProps = {
    enrollment: Record<string, unknown>;
    events: Array<{ status: string; event: string; programStage: string }>;
    programStages: Array<{ name: string; id: string; access: { data: { write: boolean } } }>;
    ownerOrgUnitId: string;
    onUpdate: (arg: Record<string, unknown>) => void;
    onUpdateStatus: (arg: Record<string, unknown>, redirect?: boolean) => void;
    onDelete: (arg: Record<string, unknown>) => void;
    onAddNew: (arg: Record<string, unknown>) => void;
    onUpdateOwnership: UpdateEnrollmentOwnership;
    canCascadeDeleteEnrollment: boolean;
    isTransferLoading: boolean;
    loading: boolean;
    canAddNew: boolean;
    onlyEnrollOnce: boolean;
    tetName: string;
    refetchEnrollment: QueryRefetchFunction;
    refetchTEI: QueryRefetchFunction;
    classes: {
        [key: string]: string;
    };
};
