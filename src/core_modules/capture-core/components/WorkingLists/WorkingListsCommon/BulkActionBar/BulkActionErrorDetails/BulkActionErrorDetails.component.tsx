import React, { useState, type ReactNode } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { colors } from '@dhis2/ui';
import { Widget } from '../../../../Widget';
import type { ErrorReport, ErrorReportHrefResolver } from '../types';

type Props = {
    introText: ReactNode;
    errorReports?: ErrorReport[];
    getRecordHref?: ErrorReportHrefResolver;
};

const styles: Readonly<any> = {
    container: {
        fontSize: '14px',
        lineHeight: '19px',
        color: colors.grey900,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
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

const BulkActionErrorDetailsPlain = ({
    introText,
    errorReports,
    getRecordHref,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const [openAccordion, setOpenAccordion] = useState(false);

    return (
        <div className={classes.container}>
            <span>{introText}</span>

            <Widget
                open={openAccordion}
                onOpen={() => setOpenAccordion(true)}
                onClose={() => setOpenAccordion(false)}
                borderless
                header={i18n.t('Details (Advanced)')}
            >
                <span className={classes.errorContainer}>
                    <ul>
                        {errorReports && errorReports.length ? errorReports.map((errorReport) => {
                            const href = getRecordHref?.(errorReport) ?? null;
                            return (
                                <li
                                    key={`${errorReport.uid}-${errorReport.errorCode}-${errorReport.message}`}
                                    className={classes.errorItem}
                                >
                                    <div className={classes.errorUidHeader}>
                                        {href ? (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {errorReport.uid}
                                            </a>
                                        ) : errorReport.uid}
                                    </div>
                                    <div>{errorReport.message}</div>
                                </li>
                            );
                        }) : (
                            <li>
                                {i18n.t('An unknown error occurred.')}
                            </li>
                        )}
                    </ul>
                </span>
            </Widget>
        </div>
    );
};

export const BulkActionErrorDetails = withStyles(styles)(BulkActionErrorDetailsPlain);
