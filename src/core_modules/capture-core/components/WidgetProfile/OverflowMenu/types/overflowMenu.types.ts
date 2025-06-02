

export type BaseProps = {
    trackedEntity: { trackedEntity: string };
    trackedEntityTypeName: string;
    trackedEntityData: Record<string, unknown>;
    canWriteData: boolean;
    onDeleteSuccess?: () => void;
    displayChangelog: boolean;
    teiId: string;
    programAPI: any;
    readOnlyMode: boolean;
};

export type OverflowMenuProps = BaseProps;

export type OverflowMenuComponentProps = BaseProps & {
    canCascadeDeleteTei: boolean;
};

export type DeleteMenuItemProps = {
    trackedEntityTypeName: string;
    canCascadeDeleteTei: boolean;
    canWriteData: boolean;
    setActionsIsOpen: (toggle: boolean) => void;
    setDeleteModalIsOpen: (toggle: boolean) => void;
};

export type DeleteModalProps = {
    trackedEntity: { trackedEntity: string };
    trackedEntityTypeName: string;
    setOpenModal: (toggle: boolean) => void;
    onDeleteSuccess?: () => void;
};

export type TrackedEntityChangelogWrapperPassOnProps = {
    teiId: string;
    isOpen: boolean;
    setIsOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
    trackedEntityData: Record<string, unknown>;
};

export type TrackedEntityChangelogWrapperProps = TrackedEntityChangelogWrapperPassOnProps & {
    programAPI: any;
};
