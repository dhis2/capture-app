export type Props = {
    programWriteAccess?: boolean;
    trackedEntityTypeWriteAccess?: boolean;
    programStageWriteAccess?: boolean;
    attributeOptionComboWriteAccess?: boolean;
    isEventBlockedByExpiry?: boolean;
    isEventBlockedByCompletion?: boolean;
    multipleStages?: boolean;
    trackedEntityName?: string;
    trackedEntityInactive?: boolean;
    inlineLabel?: boolean;
    stageId?: string;
};

export type ReadOnlyMessageInput = {
    programWriteAccess: boolean;
    trackedEntityTypeWriteAccess: boolean;
    programStageWriteAccess: boolean;
    attributeOptionComboWriteAccess?: boolean;
    trackedEntityName: string | undefined;
    multipleStages: boolean;
    isEventBlockedByExpiry: boolean;
    isEventBlockedByCompletion: boolean;
    isEventCompleted?: boolean;
    canToggleCompletion?: boolean;
    trackedEntityInactive: boolean;
    enrollmentLabel: string;
    programStageLabel: string;
    programStagesLabel: string;
    eventLabel: string;
};
