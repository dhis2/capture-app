export type TrackerType = 'ENROLLMENT' | 'EVENT' | 'TRACKED_ENTITY' | 'RELATIONSHIP';

export type ErrorReport = {
    uid?: string;
    errorCode: string;
    message: string;
    trackerType?: TrackerType;
};

export type ValidationReport = {
    errorReports: ErrorReport[];
};

export type ValidationReportContainer = {
    validationReport: ValidationReport;
};

export type ErrorReportHrefResolver = (errorReport: ErrorReport) => string | null;

export type BulkActionProps = {
    selectedRows: Record<string, boolean>;
    bulkDataEntryIsActive: boolean;
    onUpdateList: (disableClearSelection?: boolean) => void;
    removeRowsFromSelection: (rows: Array<string>) => void;
};

export type EventBulkActionProps = BulkActionProps & {
    programId?: string;
    stageDataWriteAccess?: boolean;
};

export type EnrollmentBulkActionProps = BulkActionProps & {
    programId: string;
    programDataWriteAccess: boolean;
};
