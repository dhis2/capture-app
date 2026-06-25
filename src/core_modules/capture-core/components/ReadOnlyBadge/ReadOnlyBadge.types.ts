export type Props = {
    programWriteAccess?: boolean;
    trackedEntityTypeWriteAccess?: boolean;
    programStageWriteAccess?: boolean;
    eventWithinValidPeriod?: boolean;
    canEditCompletedEvent?: boolean;
    withinCompleteEventsExpiry?: boolean;
    multipleStages?: boolean;
    trackedEntityName?: string;
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
    eventWithinValidPeriod: boolean;
    canEditCompletedEvent: boolean;
    withinCompleteEventsExpiry: boolean;
};
