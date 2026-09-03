export type Props = {
    programWriteAccess?: boolean;
    trackedEntityTypeWriteAccess?: boolean;
    programStageWriteAccess?: boolean;
    eventWithinValidPeriod?: boolean;
    canEditCompletedEvent?: boolean;
    withinCompleteEventsExpiry?: boolean;
    multipleStages?: boolean;
    trackedEntityName?: string;
    trackedEntityInactive?: boolean;
    inlineLabel?: boolean;
    programId?: string;
    stageId?: string;
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
    eventWithinValidPeriod: boolean;
    canEditCompletedEvent: boolean;
    withinCompleteEventsExpiry: boolean;
    trackedEntityInactive: boolean;
    enrollmentLabel: string;
    programStageLabel: string;
    programStagesLabel: string;
    eventLabel: string;
};
