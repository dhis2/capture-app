// @flow


export type Props = {|
    stageId: string,
    programId: string,
    enrollmentDate: string,
    scheduleDate?: ?string,
    setScheduleDate: (date: string) => void,
    incidentDate: string,
    eventData: Array<Object>,
    eventCountInOrgUnit: number,
    suggestedScheduleDate?: ?string,
    orgUnit: Object,
    ...CssClasses,
|};
