export type Props = {
    trackedEntity: { trackedEntity: string };
    trackedEntityTypeName: string;
    setOpenModal: (toggle: boolean) => void;
    onDeleteSuccess?: () => void;
};
