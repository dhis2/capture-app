import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { Button, ButtonStrip, colors, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { Widget } from '../../../../Widget';
import type { ErrorReport, ErrorReportHrefResolver } from '../types';

type Props = {
    title: string;
    introText: string;
    errorReports?: ErrorReport[];
    getRecordHref?: ErrorReportHrefResolver;
    onClose: () => void;
    dataTest?: string;
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
    errorList: {
        margin: 0,
    },
    errorItem: {
        marginBottom: '8px',
    },
    errorUidHeader: {
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
};

const BulkActionErrorModalPlain = ({
    title,
    introText,
    errorReports,
    getRecordHref,
    onClose,
    dataTest,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const [openAccordion, setOpenAccordion] = useState(false);

    return (
        <Modal
            onClose={onClose}
            dataTest={dataTest}
        >
            <ModalTitle>{title}</ModalTitle>
            <ModalContent>
                <div className={classes.container}>
                    <span>{introText}</span>

                    <Widget
                        open={openAccordion}
                        onOpen={() => setOpenAccordion(true)}
                        onClose={() => setOpenAccordion(false)}
                        header={i18n.t('Details (Advanced)')}
                    >
                        <ul className={classes.errorList}>
                            {errorReports?.length ? errorReports.map((errorReport) => {
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
                    </Widget>
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button
                        secondary
                        onClick={onClose}
                    >
                        {i18n.t('Close')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
};

export const BulkActionErrorModal = withStyles(styles)(BulkActionErrorModalPlain);
