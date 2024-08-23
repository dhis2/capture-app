// @flow

export type EventRowProps = {|
    id: string,
    pendingApiResponse: boolean,
    eventDetails: ApiEnrollmentEvent,
    cells: Array<React$Element<any>>,
    onEventClick: (id: string, options: ?Object) => void,
    onDeleteEvent: (id: string) => void,
    onUpdateEventStatus: (id: string, status: string) => void,
    onRollbackDeleteEvent: (event: ApiEnrollmentEvent) => void,
    stageWriteAccess: boolean,
    teiId: string,
    programId: string,
    enrollmentId: string,
    ...CssClasses,
|};
