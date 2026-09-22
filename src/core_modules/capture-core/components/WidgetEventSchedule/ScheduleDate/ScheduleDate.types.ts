import type { OrgUnitValue, Validation } from '../widgetEventSchedule.types';

export type PlainProps = {
    stageId: string;
    programId: string;
    enrolledAt: string;
    displayDueDateLabel?: string | null;
    scheduleDate?: string | null;
    serverScheduleDate?: string | null;
    setScheduleDate: (date: string) => void;
    occurredAt: string;
    eventData: Array<any>;
    eventCountInOrgUnit: number;
    serverSuggestedScheduleDate?: string | null;
    hideDueDate?: boolean;
    orgUnit?: OrgUnitValue | null;
    expiryPeriod?: {
        expiryPeriodType?: string | null;
        expiryDays?: number | null;
    };
    validation?: Validation;
    setValidation: (validation: Validation) => void;
    saveAttempted: boolean;
};
