type TrackedEntityRef = {
    trackedEntity: string;
    trackedEntityType?: string;
    orgUnit?: string;
};

export type Props = {
    trackedEntity: TrackedEntityRef;
    trackedEntityTypeName: string;
    trackedEntityData: Record<string, any>;
    canWriteData: boolean;
    canWriteTETData: boolean;
    isInactive: boolean;
    onDeleteSuccess?: () => void;
    onStatusToggleSuccess?: () => void;
    displayChangelog: boolean;
    teiId: string;
    programAPI: any;
    readOnlyMode: boolean;
};

export type PlainProps = {
    trackedEntity: TrackedEntityRef;
    trackedEntityTypeName: string;
    trackedEntityData: Record<string, any>;
    canWriteData: boolean;
    canWriteTETData: boolean;
    canCascadeDeleteTei: boolean;
    isInactive: boolean;
    onDeleteSuccess?: () => void;
    onStatusToggleSuccess?: () => void;
    displayChangelog: boolean;
    teiId: string;
    programAPI: any;
    readOnlyMode: boolean;
};
