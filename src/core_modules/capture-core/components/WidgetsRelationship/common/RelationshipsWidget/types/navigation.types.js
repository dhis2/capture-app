// @flow

export type NavigationArgsTrackedEntity = $ReadOnly<{|
    programId?: string,
    trackedEntityId: string,
|}>;

export type NavigationArgsEvent = $ReadOnly<{|
    eventId: string,
    programId: string,
|}>;

export type NavigationArgs = NavigationArgsTrackedEntity | NavigationArgsEvent;

export type LinkedRecordClick = (navigationArgs: NavigationArgs) => void;
