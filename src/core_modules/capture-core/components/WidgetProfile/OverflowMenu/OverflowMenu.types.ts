import type { Dispatch, SetStateAction } from 'react';

type TrackedEntityRef = { trackedEntity: string };
type TrackedEntityForToggle = {
    trackedEntity: string;
    trackedEntityType: string;
    orgUnit: string;
};

export type Props = {
    trackedEntity: TrackedEntityRef;
    trackedEntityForToggle?: TrackedEntityForToggle | null;
    trackedEntityTypeName: string;
    trackedEntityData: Record<string, any>;
    canWriteData: boolean;
    canToggleStatus: boolean;
    trackedEntityInactive: boolean;
    onDeleteSuccess?: () => void;
    onStatusToggleSuccess?: () => void;
    displayChangelog: boolean;
    teiId: string;
    programAPI: any;
    readOnlyMode: boolean;
};

export type MenuFlyoutProps = {
    displayChangelog: boolean;
    canShowDeactivate: boolean;
    canShowDelete: boolean;
    trackedEntityTypeName: string;
    trackedEntityInactive: boolean;
    canWriteData: boolean;
    canCascadeDeleteTei: boolean;
    setActionsIsOpen: Dispatch<SetStateAction<boolean>>;
    setChangelogIsOpen: Dispatch<SetStateAction<boolean>>;
    setDeactivateModalIsOpen: Dispatch<SetStateAction<boolean>>;
    setDeleteModalIsOpen: Dispatch<SetStateAction<boolean>>;
};

export type ModalsProps = {
    deleteModalIsOpen: boolean;
    deactivateModalIsOpen: boolean;
    changelogIsOpen: boolean;
    trackedEntity: PlainProps['trackedEntity'];
    trackedEntityForToggle: PlainProps['trackedEntityForToggle'];
    trackedEntityTypeName: string;
    trackedEntityInactive: boolean;
    trackedEntityData: PlainProps['trackedEntityData'];
    teiId: string;
    programAPI: PlainProps['programAPI'];
    onDeleteSuccess?: () => void;
    onStatusToggleSuccess?: () => void;
    setDeleteModalIsOpen: Dispatch<SetStateAction<boolean>>;
    setDeactivateModalIsOpen: Dispatch<SetStateAction<boolean>>;
    setChangelogIsOpen: Dispatch<SetStateAction<boolean>>;
};

export type PlainProps = {
    trackedEntity: TrackedEntityRef;
    trackedEntityForToggle?: TrackedEntityForToggle | null;
    trackedEntityTypeName: string;
    trackedEntityData: Record<string, any>;
    canWriteData: boolean;
    canCascadeDeleteTei: boolean;
    canToggleStatus: boolean;
    trackedEntityInactive: boolean;
    onDeleteSuccess?: () => void;
    onStatusToggleSuccess?: () => void;
    displayChangelog: boolean;
    teiId: string;
    programAPI: any;
    readOnlyMode: boolean;
};
