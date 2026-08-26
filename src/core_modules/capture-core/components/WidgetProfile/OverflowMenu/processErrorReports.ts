import { v4 as uuid } from 'uuid';

export type ErrorReport = { message: string; uid: string };

export const processErrorReports = (error: any): Array<ErrorReport> => {
    const errorReports = error?.details?.validationReport?.errorReports;
    return errorReports?.length > 0 ? errorReports : [{ uid: uuid(), message: error.message }];
};
