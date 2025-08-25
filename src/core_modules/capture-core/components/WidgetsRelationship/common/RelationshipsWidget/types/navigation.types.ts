export type NavigationArgsTrackedEntity = {
    readonly programId?: string;
    readonly trackedEntityId: string;
};

export type NavigationArgsEvent = {
    readonly eventId: string;
    readonly programId: string;
};

export type NavigationArgs = NavigationArgsTrackedEntity | NavigationArgsEvent;

export type LinkedRecordClick = (navigationArgs: NavigationArgs) => void;
