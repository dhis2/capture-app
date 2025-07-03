export type NavigationArgsTrackedEntity = Readonly<{
    programId?: string;
    trackedEntityId: string;
}>;

export type NavigationArgsEvent = Readonly<{
    eventId: string;
    programId: string;
}>;

export type NavigationArgs = NavigationArgsTrackedEntity | NavigationArgsEvent;

export type LinkedRecordClick = (navigationArgs: NavigationArgs) => void;
