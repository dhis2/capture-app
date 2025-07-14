import type { ProgramCategory, CategoryOption } from './CategoryOptions/CategoryOptions.types';
import type { UserFormField } from '../FormFields/UserField';

export type ContainerProps = {
   programId: string;
   stageId: string;
   eventData: any;
   enrolledAt: string;
   occurredAt: string;
   orgUnitId: string;
   teiId: string;
   enrollmentId: string;
   initialScheduleDate?: string;
   hideDueDate?: boolean;
   selectedCategories?: { [categoryId: string]: CategoryOption } | null;
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
   eventData: any;
   enrolledAt: string;
   occurredAt: string;
   displayDueDateLabel: string;
   orgUnit?: {
      id: string;
      name: string;
      path: string;
   } | null;
   stageName: string;
   programName: string;
   scheduleDate?: string | null;
   serverScheduleDate?: string | null;
   suggestedScheduleDate?: string | null;
   expiryPeriod?: {
      expiryPeriodType: string | null;
      expiryDays: number | null;
   };
   setScheduledOrgUnit: (orgUnit: {
      id: string;
      name: string;
      path: string;
  } | null) => void;
   setIsFormValid: (valid: boolean) => void;
   serverSuggestedScheduleDate?: string | null;
   eventCountInOrgUnit: number;
   notes: Array<{
      value: string;
      storedAt?: string;
      storedBy?: string;
      createdBy?: any;
      note?: string;
   }>;
   hideDueDate?: boolean;
   selectedCategories?: { [categoryId: string]: CategoryOption } | null;
   programCategory?: ProgramCategory;
   categoryOptionsError?: {[categoryId: string]: { touched: boolean; valid: boolean} } | null;
   enableUserAssignment?: boolean;
   onSchedule: () => void;
   onSetAssignee: (user: any) => void;
   assignee?: UserFormField | null;
   onCancel: () => void;
   setScheduleDate: (date: string | null) => void;
   onAddNote: (note: string) => void;
   onResetCategoryOption: (categoryId: string) => void;
   onClickCategoryOption: (optionId: string, categoryId: string) => void;
   validation?: {
      error: boolean;
      validationText: string;
    } | null;
    setValidation: (validation: {
      error: boolean;
      validationText: string;
    }) => void;
    classes: any;
};
