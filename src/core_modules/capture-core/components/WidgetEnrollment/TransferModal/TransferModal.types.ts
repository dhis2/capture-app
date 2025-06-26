import type { UpdateEnrollmentOwnership } from '../Actions/Transfer/hooks/useUpdateOwnership';

export type TransferModalProps = {
    enrollment: { program: string };
    ownerOrgUnitId: string;
    setOpenTransfer: (toggle: boolean) => void;
    onUpdateOwnership: UpdateEnrollmentOwnership;
    isTransferLoading: boolean;
};
