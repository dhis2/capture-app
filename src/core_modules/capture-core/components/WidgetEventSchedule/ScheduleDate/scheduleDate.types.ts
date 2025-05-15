import type { OrgUnitValue } from '../ScheduleOrgUnit/ScheduleOrgUnit.component';

export type Props = {
    stageId: string;
    programId: string;
    enrolledAt: string;
    displayDueDateLabel: string;
    scheduleDate?: string;
    serverScheduleDate?: string;
    setScheduleDate: (date: string) => void;
    occurredAt: string;
    eventData: Array<any>;
    eventCountInOrgUnit: number;
    serverSuggestedScheduleDate?: string;
    hideDueDate?: boolean;
    orgUnit: Partial<OrgUnitValue>;
    validation?: {
        error: boolean;
        validationText: string;
    };
    setValidation: (validation: {
        error: boolean;
        validationText: string;
    }) => void;
    classes: {
        fieldWrapper: string;
        fieldLabel: string;
        infoBox: string;
    };
};
