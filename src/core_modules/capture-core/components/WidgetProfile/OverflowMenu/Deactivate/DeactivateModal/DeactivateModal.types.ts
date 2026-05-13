export type TrackedEntityForToggle = {
    trackedEntity: string;
    trackedEntityType: string;
    orgUnit: string;
};

export type Props = {
    trackedEntity: TrackedEntityForToggle;
    trackedEntityTypeName: string;
    trackedEntityInactive: boolean;
    setOpenModal: (toggle: boolean) => void;
    onStatusToggleSuccess?: () => void;
};
