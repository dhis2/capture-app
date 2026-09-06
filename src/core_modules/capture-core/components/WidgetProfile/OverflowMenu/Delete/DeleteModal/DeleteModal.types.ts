export type Props = {
    trackedEntity: { trackedEntity: string };
    trackedEntityTypeName: string;
    program: Record<string, unknown>;
    setOpenModal: (toggle: boolean) => void;
    onDeleteSuccess?: () => void;
};
