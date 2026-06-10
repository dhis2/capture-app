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
