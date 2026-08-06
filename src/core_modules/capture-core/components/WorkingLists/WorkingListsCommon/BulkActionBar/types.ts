export type TrackerType = 'ENROLLMENT' | 'EVENT' | 'TRACKED_ENTITY' | 'RELATIONSHIP';

export type ErrorReport = {
    uid?: string;
    errorCode?: string;
    message?: string;
    trackerType?: TrackerType;
};

export type ValidationReport = {
    errorReports: ErrorReport[];
};

export type ValidationReportContainer = {
    validationReport: ValidationReport;
};

// Already-anchor-ready (`#/...` for HashRouter). Null means render the UID as plain text.
export type ErrorReportHrefResolver = (errorReport: ErrorReport) => string | null;
