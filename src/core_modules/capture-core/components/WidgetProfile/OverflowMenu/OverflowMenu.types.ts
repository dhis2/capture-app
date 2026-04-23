export type Props = {
    trackedEntity: { trackedEntity: string; [key: string]: any };
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
    trackedEntity: { trackedEntity: string; [key: string]: any };
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
