// @flow

export type ContainerProps = {|
   programId: string,
   stageId: string,
   eventData: Object,
   enrolledAt: string,
   occurredAt: string,
   orgUnitId: string,
   teiId: string,
   enrollmentId: string,
   onSave: (eventServerValues: Object, uid: string) => void,
   onSaveSuccessActionType: string,
   onSaveErrorActionType: string,
   onCancel: () => void,
|};

export type Props = {|
   programId: string,
   stageId: string,
   eventData: Object,
   enrolledAt: string,
   occurredAt: string,
   orgUnit: Object,
   stageName: string,
   programName: string,
   scheduleDate?: ?string,
   suggestedScheduleDate?: ?string,
   eventCountInOrgUnit: number,
   comments: Array<{value: string}>,
   onSchedule: () => void,
   onCancel: () => void,
   setScheduleDate: (date: string) => void,
   onAddComment: (comment: string) => void,
   ...CssClasses
|};
