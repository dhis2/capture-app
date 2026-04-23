export type Props = {
    trackedEntity: { trackedEntity: string; [key: string]: any };
    trackedEntityTypeName: string;
    isInactive: boolean;
    setOpenModal: (toggle: boolean) => void;
    onStatusToggleSuccess?: () => void;
};
