import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { getRecordUrlFromErrorReport } from '../utils';

type ErrorReport = {
    uid?: string;
    errorCode?: string;
    message?: string;
    trackerType?: 'ENROLLMENT' | 'EVENT' | string;
};

type Props = {
    errorReports?: Array<ErrorReport>;
    programId?: string;
    orgUnitId?: string;
    enrollmentIdToTeiId?: Record<string, string>;
};

const styles: Readonly<any> = {
    errorContainer: {
        padding: '0px 20px',
    },
    errorItem: {
        marginBottom: '8px',
    },
    errorUidHeader: {
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
};

const BulkActionErrorReportsPlain = ({
    errorReports,
    programId,
    orgUnitId,
    enrollmentIdToTeiId,
    classes,
}: Props & WithStyles<typeof styles>) => (
    <span className={classes.errorContainer}>
        <ul>
            {errorReports && errorReports.length ? errorReports.map((errorReport) => {
                const recordUrl = getRecordUrlFromErrorReport({
                    errorReport,
                    programId,
                    orgUnitId,
                    enrollmentIdToTeiId,
                });
                return (
                    <li
                        key={`${errorReport.uid}-${errorReport.errorCode}`}
                        className={classes.errorItem}
                    >
                        <div className={classes.errorUidHeader}>
                            {recordUrl ? (
                                <a
                                    href={recordUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {errorReport.uid}
                                </a>
                            ) : errorReport.uid}
                        </div>
                        <div>{errorReport?.message}</div>
                    </li>
                );
            }) : (
                <li>
                    {i18n.t('An unknown error occurred.')}
                </li>
            )}
        </ul>
    </span>
);

export const BulkActionErrorReports = withStyles(styles)(BulkActionErrorReportsPlain);
