// @flow

export type ContainerProps = {|
   programId: string,
   stageId: string,
   eventData: Object,
   enrollmentDate: string,
   incidentDate: string,
   orgUnitId: string,
   teiId: string,
   enrollmentId: string,
|};

export type Props = {|
   programId: string,
   stageId: string,
   eventData: Object,
   enrollmentDate: string,
   incidentDate: string,
   orgUnit: Object,
   stageName: string,
   programName: string,
   scheduleDate?: ?string,
   suggestedScheduleDate?: ?string,
   eventCountInOrgUnit: number,
   onSchedule: () => Promise<void>,
   setScheduleDate: (date: string) => void,
   onAddComment: () => Promise<void>,
   ...CssClasses
|};
