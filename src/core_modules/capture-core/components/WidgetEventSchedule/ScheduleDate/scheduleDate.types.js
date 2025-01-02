// @flow


export type Props = {|
    stageId: string,
    programId: string,
    enrolledAt: string,
    displayDueDateLabel: string,
    scheduleDate?: ?string,
    serverScheduleDate?: ?string,
    setScheduleDate: (date: string) => void,
    occurredAt: string,
    eventData: Array<Object>,
    eventCountInOrgUnit: number,
    serverSuggestedScheduleDate?: ?string,
    hideDueDate?: boolean,
    orgUnit: { id: string, name: string },
    ...CssClasses,
|};
