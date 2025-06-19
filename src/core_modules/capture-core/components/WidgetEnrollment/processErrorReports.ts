export const processErrorReports = (error: any): string => {
    const errorReports = error?.details?.validationReport?.errorReports;
    return errorReports?.length > 0
        ? errorReports.reduce((acc: string, errorReport: any) => `${acc} ${errorReport.message}`, '')
        : error.message;
};
