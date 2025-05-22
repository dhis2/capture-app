import type { UpdateEnrollmentOwnership } from '../Actions/Transfer/hooks/useUpdateOwnership';

export type TransferModalProps = {
    enrollment: Record<string, unknown>;
    ownerOrgUnitId: string;
    setOpenTransfer: (toggle: boolean) => void;
    onUpdateOwnership: UpdateEnrollmentOwnership;
    isTransferLoading: boolean;
};
