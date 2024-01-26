// @flow
import type { ProgramCategory, CategoryOption } from './CategoryOptions/CategoryOptions.types';
import type { UserFormField } from '../FormFields/UserField';

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
   assignee?: UserFormField | null,
   enableUserAssignment?: boolean,
|};

export type Props = {|
   programId: string,
   stageId: string,
   eventData: Object,
   enrolledAt: string,
   occurredAt: string,
   displayDueDateLabel: string,
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
   categoryOptionsError?: ?{[categoryId: string]: { touched: boolean, valid: boolean} },
   enableUserAssignment?: boolean,
   onSchedule: () => void,
   onSetAssignee: () => void,
   assignee?: UserFormField | null,
   onCancel: () => void,
   setScheduleDate: (date: string) => void,
   onAddComment: (comment: string) => void,
   onResetCategoryOption: (categoryId: string) => void,
   onClickCategoryOption: (optionId: string, categoryId: string) => void,
   ...CssClasses
|};
