export type PlainProps = {
    stageId: string;
    programId: string;
    enrolledAt: string;
    displayDueDateLabel: string;
    scheduleDate?: string | null;
    serverScheduleDate?: string | null;
    setScheduleDate: (date: string) => void;
    occurredAt: string;
    eventData: Array<any>;
    eventCountInOrgUnit: number;
    serverSuggestedScheduleDate?: string | null;
    hideDueDate?: boolean;
    orgUnit?: {
        checked: boolean;
        id: string;
        children: number;
        name: string;
        displayName: string;
        path: string;
        selected: string[];
    } | null;
    expiryPeriod?: {
        expiryPeriodType?: string | null;
        expiryDays?: number | null;
    };
    validation?: {
        error: boolean;
        validationText: string;
    };
    setValidation: (validation: {
        error: boolean;
        validationText: string;
    }) => void;
};
