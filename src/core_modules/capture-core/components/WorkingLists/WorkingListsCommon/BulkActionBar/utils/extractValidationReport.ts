// A tracker validation report can arrive on either the success `data` payload
// (e.g. atomicMode=OBJECT partial success) or on the error response's `details`
// (HTTP-error case). Callers only care about the container that holds
// `validationReport.errorReports` — use this to normalize both paths.
export const extractValidationReport = ({ data, error }: { data?: any; error?: any }): any | null => {
    if (data?.validationReport?.errorReports?.length) {
        return data;
    }
    if (error?.details?.validationReport?.errorReports?.length) {
        return error.details;
    }
    return null;
};
