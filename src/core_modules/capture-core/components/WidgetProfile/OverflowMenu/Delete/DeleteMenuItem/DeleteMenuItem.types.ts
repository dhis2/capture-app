export type Props = {
    trackedEntityTypeName: string;
    canCascadeDeleteTei: boolean;
    canWriteData: boolean;
    setActionsIsOpen: (toggle: boolean) => void;
    setDeleteModalIsOpen: (toggle: boolean) => void;
};
