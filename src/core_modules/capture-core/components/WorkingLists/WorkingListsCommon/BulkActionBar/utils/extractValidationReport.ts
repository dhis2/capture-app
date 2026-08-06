import type { ValidationReportContainer } from '../types';

// A tracker validation report can arrive on either the success `data` payload
// (e.g. atomicMode=OBJECT partial success) or on the error response's `details`
// (HTTP-error case). Callers only care about the container that holds
// `validationReport.errorReports` — use this to normalize both paths.
export const extractValidationReport = ({ data, error }: {
    data?: unknown;
    error?: { details?: unknown } | null;
}): ValidationReportContainer | null => {
    const fromData = data as ValidationReportContainer | undefined;
    if (fromData?.validationReport?.errorReports?.length) {
        return fromData;
    }
    const fromError = error?.details as ValidationReportContainer | undefined;
    if (fromError?.validationReport?.errorReports?.length) {
        return fromError;
    }
    return null;
};
