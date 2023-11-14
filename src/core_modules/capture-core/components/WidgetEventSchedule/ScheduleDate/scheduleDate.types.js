// @flow


export type Props = {|
    stageId: string,
    programId: string,
    enrolledAt: string,
    scheduleDate?: ?string,
    setScheduleDate: (date: string) => void,
    occurredAt: string,
    eventData: Array<Object>,
    eventCountInOrgUnit: number,
    suggestedScheduleDate?: ?string,
    hideDueDate?: boolean,
    orgUnit: { id: string, name: string },
    ...CssClasses,
|};
