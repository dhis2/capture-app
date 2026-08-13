export type Props = {
    programWriteAccess?: boolean;
    trackedEntityTypeWriteAccess?: boolean;
    programStageWriteAccess?: boolean;
    canEditExpiredEvent?: boolean;
    canEditCompletedEvent?: boolean;
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
    canEditExpiredEvent: boolean;
    canEditCompletedEvent: boolean;
    trackedEntityInactive: boolean;
};
