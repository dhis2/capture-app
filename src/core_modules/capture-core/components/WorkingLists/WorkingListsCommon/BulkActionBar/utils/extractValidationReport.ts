import type { ValidationReportContainer } from '../types';

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
