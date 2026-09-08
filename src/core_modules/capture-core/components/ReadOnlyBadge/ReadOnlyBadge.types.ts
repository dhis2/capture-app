export type Props = {
    programWriteAccess?: boolean;
    trackedEntityTypeWriteAccess?: boolean;
    programStageWriteAccess?: boolean;
    isEventBlockedByExpiry?: boolean;
    isEventBlockedByCompletion?: boolean;
    multipleStages?: boolean;
    trackedEntityName?: string;
    trackedEntityInactive?: boolean;
    inlineLabel?: boolean;
};

export type Access = {
    program: boolean;
    trackedEntityType: boolean;
    programStage: boolean;
};

export type ReadOnlyMessageInput = {
    access: Access;
    trackedEntityName: string | undefined;
    multipleStages: boolean;
    isEventBlockedByExpiry: boolean;
    isEventBlockedByCompletion: boolean;
    isEventCompleted?: boolean;
    canToggleCompletion?: boolean;
    trackedEntityInactive: boolean;
};
