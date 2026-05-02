export type Props = {
    trackedEntityTypeName: string;
    canCascadeDeleteTei: boolean;
    readOnly: boolean;
    setActionsIsOpen: (toggle: boolean) => void;
    setDeleteModalIsOpen: (toggle: boolean) => void;
};
