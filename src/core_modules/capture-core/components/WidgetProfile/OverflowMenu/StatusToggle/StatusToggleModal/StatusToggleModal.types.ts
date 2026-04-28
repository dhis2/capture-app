export type Props = {
    trackedEntity: {
        trackedEntity: string;
        trackedEntityType?: string;
        orgUnit?: string;
    };
    trackedEntityTypeName: string;
    isInactive: boolean;
    setOpenModal: (toggle: boolean) => void;
    onStatusToggleSuccess?: () => void;
};
