// @flow
export const processErrorReports = (error: any) => {
    // $FlowFixMe[prop-missing]
    const errorReports = error?.details?.validationReport?.errorReports;
    return errorReports?.length > 0
        ? errorReports.reduce((acc, errorReport) => `${acc} ${errorReport.message}`, '')
        : error.message;
};
