// @flow
import type { ProgramCategory, CategoryOption } from '../FormFields/New/CategoryOptions/CategoryOptions.types';

export type ContainerProps = {|
   programId: string,
   stageId: string,
   eventData: Object,
   enrolledAt: string,
   occurredAt: string,
   orgUnitId: string,
   teiId: string,
   enrollmentId: string,
   initialScheduleDate?: string,
   hideDueDate?: boolean,
   selectedCategories?: ?{ [categoryId: string]: CategoryOption },
   programCategory?: ProgramCategory,
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
   dueDateLabel: string,
   orgUnit: Object,
   stageName: string,
   programName: string,
   scheduleDate?: ?string,
   suggestedScheduleDate?: ?string,
   eventCountInOrgUnit: number,
   comments: Array<{value: string}>,
   hideDueDate?: boolean,
   selectedCategories?: ?{ [categoryId: string]: CategoryOption },
   programCategory?: ProgramCategory,
   categoryOptionsError?: boolean,
   onSchedule: () => void,
   onCancel: () => void,
   setScheduleDate: (date: string) => void,
   onAddComment: (comment: string) => void,
   onResetCategoryOption: (categoryId: string) => void,
   onClickCategoryOption: (option: { label: string, value: string }, categoryId: string, isValid: boolean) => void,
   ...CssClasses
|};
