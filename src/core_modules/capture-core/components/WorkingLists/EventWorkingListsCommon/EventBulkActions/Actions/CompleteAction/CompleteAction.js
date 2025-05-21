// @flow
import React, { type ComponentType, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Button, ButtonStrip, colors, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { useBulkCompleteEvents } from './hooks/useBulkCompleteEvents';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import { Widget } from '../../../../../Widget';

type Props = {|
    selectedRows: { [key: string]: boolean },
    stageDataWriteAccess?: boolean,
    bulkDataEntryIsActive?: boolean,
    onUpdateList: (disableClearSelections?: boolean) => void,
    removeRowsFromSelection: (rows: Array<string>) => void,
|}

const styles = {
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
};

const getTooltipContent = (stageDataWriteAccess?: boolean, bulkDataEntryIsActive?: boolean) => {
    if (!stageDataWriteAccess) {
        return i18n.t('You do not have access to complete events');
    }
    if (bulkDataEntryIsActive) {
        return i18n.t('There is a bulk data entry with unsaved changes');
    }
    return '';
};

const CompleteActionPlain = ({
    selectedRows,
    stageDataWriteAccess,
    bulkDataEntryIsActive,
    removeRowsFromSelection,
    onUpdateList,
    classes,
}: Props & CssClasses) => {
    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
    const [openAccordion, setOpenAccordion] = useState(false);
    const tooltipContent = getTooltipContent(stageDataWriteAccess, bulkDataEntryIsActive);
    const disabled = !stageDataWriteAccess || bulkDataEntryIsActive;
    const {
        eventCounts,
        isLoading,
        isCompletingEvents,
        onCompleteEvents,
        validationError,
    } = useBulkCompleteEvents({
        selectedRows,
        isCompleteDialogOpen,
        setIsCompleteDialogOpen,
        removeRowsFromSelection,
        onUpdateList,
    });

    return (
        <>
            <ConditionalTooltip
                enabled={disabled}
                content={tooltipContent}
            >
                <Button
                    small
                    onClick={() => setIsCompleteDialogOpen(true)}
                    disabled={disabled}
                >
                    {i18n.t('Complete')}
                </Button>
            </ConditionalTooltip>

            {isCompleteDialogOpen && eventCounts && !validationError && (
                <Modal
                    small
                    onClose={() => setIsCompleteDialogOpen(false)}
                    dataTest={'bulk-complete-events-dialog'}
                >
                    <ModalTitle>
                        {i18n.t('Complete events')}
                    </ModalTitle>

                    <ModalContent>
                        <span className={classes.container}>
                            {eventCounts.active > 0 ?
                                i18n.t('Are you sure you want to complete all active events in selection?')
                                :
                                i18n.t('There are no active events to complete in the current selection.')
                            }
                        </span>
                    </ModalContent>

                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                secondary
                                onClick={() => setIsCompleteDialogOpen(false)}
                            >
                                {i18n.t('Cancel')}
                            </Button>

                            <Button
                                primary
                                onClick={onCompleteEvents}
                                disabled={isLoading || eventCounts?.active === 0 || !eventCounts}
                                loading={isCompletingEvents}
                            >
                                {i18n.t('Complete')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>

                </Modal>
            )}

            {isCompleteDialogOpen && validationError && (
                <Modal
                    small
                    onClose={() => setIsCompleteDialogOpen(false)}
                    dataTest={'bulk-complete-events-dialog'}
                >
                    <ModalTitle>
                        {i18n.t('Error completing events')}
                    </ModalTitle>

                    <ModalContent>
                        <span className={classes.container}>
                            {i18n.t('There was an error completing the events.')}

                            <Widget
                                open={openAccordion}
                                onOpen={() => setOpenAccordion(true)}
                                onClose={() => setOpenAccordion(false)}
                                borderless
                                header={i18n.t('Details (Advanced)')}
                            >
                                <span className={classes.errorContainer}>
                                    <ul>
                                        {validationError?.validationReport?.errorReports ?
                                            validationError.validationReport.errorReports.map(errorReport => (
                                                <li key={`${errorReport.uid}-${errorReport.errorCode}`}>
                                                    {errorReport?.message}
                                                </li>
                                            )) : (
                                                <li>
                                                    {i18n.t('An unknown error occurred.')}
                                                </li>
                                            )
                                        }
                                    </ul>
                                </span>
                            </Widget>
                        </span>
                    </ModalContent>


                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                secondary
                                onClick={() => setIsCompleteDialogOpen(false)}
                            >
                                {i18n.t('Close')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    );
};

export const CompleteAction: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(CompleteActionPlain);
