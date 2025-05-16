import type { ProgramCategory, CategoryOption } from './CategoryOptions/CategoryOptions.types';
import type { User as UserFormField } from '../FormFields/UserField/types';
import type { NoteType } from '../WidgetNote/NoteSection/NoteSection.types';
import type { OrgUnitValue } from './ScheduleOrgUnit/ScheduleOrgUnit.component';

export type ContainerProps = {
   programId: string;
   stageId: string;
   eventData: Array<any>;
   enrolledAt: string;
   occurredAt: string;
   orgUnitId: string;
   teiId: string;
   enrollmentId: string;
   initialScheduleDate?: string;
   hideDueDate?: boolean;
   selectedCategories?: { [categoryId: string]: CategoryOption };
   programCategory?: ProgramCategory;
   onSave: (eventServerValues: any, uid: string) => void;
   onSaveSuccessActionType: string;
   onSaveErrorActionType: string;
   onCancel: () => void;
   assignee?: UserFormField | null;
   enableUserAssignment?: boolean;
};

export type Props = {
   programId: string;
   stageId: string;
   eventData: Array<any>;
   enrolledAt: string;
   occurredAt: string;
   displayDueDateLabel: string;
   orgUnit: Partial<OrgUnitValue>;
   stageName: string;
   programName: string;
   scheduleDate?: string;
   serverScheduleDate?: string;
   suggestedScheduleDate?: string;
   setScheduledOrgUnit: (orgUnit?: {
      id: string;
      name: string;
      path: string;
   }) => void;
   setIsFormValid: (valid: boolean) => void;
   serverSuggestedScheduleDate?: string;
   eventCountInOrgUnit: number;
   notes: Array<NoteType>;
   hideDueDate?: boolean;
   selectedCategories?: { [categoryId: string]: string };
   programCategory?: ProgramCategory;
   categoryOptionsError?: {[categoryId: string]: { touched: boolean, valid: boolean} };
   enableUserAssignment?: boolean;
   onSchedule: () => void;
   onSetAssignee: (user: UserFormField) => void;
   assignee?: UserFormField | null;
   onCancel: () => void;
   setScheduleDate: (date: string | undefined) => void;
   onAddNote: (note: string) => void;
   onResetCategoryOption: (categoryId: string) => void;
   onClickCategoryOption: (optionId: string, categoryId: string) => void;
   validation?: {
      error: boolean;
      validationText: string;
   };
   setValidation: (validation: {
      error: boolean;
      validationText: string;
   }) => void;
   classes: {
      wrapper: string;
      evenNumbersRecords: string;
      divider: string;
   };
};
