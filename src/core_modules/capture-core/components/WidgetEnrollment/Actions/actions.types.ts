import type { WithStyles } from '@material-ui/core';
import type { UpdateEnrollmentOwnership } from './Transfer/hooks/useUpdateOwnership';

type QueryRefetchFunction = any;

export type Props = {
    enrollment: Record<string, any>;
    events: Array<{ status: string; event: string; programStage: string }>;
    programStages: Array<{ name: string; id: string; access: { data: { write: boolean } } }>;
    refetchEnrollment: QueryRefetchFunction;
    refetchTEI: QueryRefetchFunction;
    ownerOrgUnitId: string;
    onDelete: () => void;
    onAddNew: () => void;
    onUpdateEnrollmentStatus?: (enrollment: Record<string, any>) => void;
    onUpdateEnrollmentStatusSuccess?: (params: { redirect?: boolean }) => void;
    onUpdateEnrollmentStatusError?: (message: string) => void;
    onError?: (message: string) => void;
    onSuccess?: () => void;
    canAddNew: boolean;
    onlyEnrollOnce: boolean;
    tetName: string;
    onAccessLostFromTransfer?: () => void;
};

export type PlainProps = {
    enrollment: Record<string, any>;
    events: Array<{ status: string; event: string; programStage: string }>;
    programStages: Array<{ name: string; id: string; access: { data: { write: boolean } } }>;
    ownerOrgUnitId: string;
    onUpdate: (arg: Record<string, any>) => void;
    onUpdateStatus: (arg: Record<string, any>, redirect?: boolean) => void;
    onDelete: (arg: Record<string, any>) => void;
    onAddNew: (arg: Record<string, any>) => void;
    onUpdateOwnership: UpdateEnrollmentOwnership;
    canCascadeDeleteEnrollment: boolean;
    isTransferLoading: boolean;
    loading: boolean;
    canAddNew: boolean;
    onlyEnrollOnce: boolean;
    tetName: string;
} & WithStyles<any>;
