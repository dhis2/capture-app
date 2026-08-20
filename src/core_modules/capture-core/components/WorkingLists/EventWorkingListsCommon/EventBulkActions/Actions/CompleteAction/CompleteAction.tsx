import React, { type ComponentType, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import {
    Button, ButtonStrip, colors, Modal, ModalActions, ModalContent, ModalTitle,
} from '@dhis2/ui';
import { useBulkCompleteEvents } from './hooks/useBulkCompleteEvents';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import { BulkActionErrorModal } from '../../../../WorkingListsCommon/BulkActionBar/BulkActionErrorModal';
import { createEventErrorHrefResolver } from '../../../../WorkingListsCommon/BulkActionBar/utils';
import { useLocationQuery } from '../../../../../../utils/routing';
import type { Props } from './CompleteAction.types';

const styles: Readonly<any> = {
    container: {
        fontSize: '14px',
        lineHeight: '19px',
        color: colors.grey900,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
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
    programId,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
    const { orgUnitId } = useLocationQuery();
    const disabled = !stageDataWriteAccess || Boolean(bulkDataEntryIsActive);
    const tooltipContent = getTooltipContent(stageDataWriteAccess, bulkDataEntryIsActive);

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
        programId,
    });

    const getRecordHref = useMemo(
        () => createEventErrorHrefResolver({
            programId,
            orgUnitId,
            knownEventUids: new Set(Object.keys(selectedRows)),
        }),
        [programId, orgUnitId, selectedRows],
    );

    const closeDialog = () => setIsCompleteDialogOpen(false);

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
                    onClose={closeDialog}
                    dataTest="bulk-complete-events-dialog"
                >
                    <ModalTitle>{i18n.t('Complete events')}</ModalTitle>
                    <ModalContent>
                        <span className={classes.container}>
                            {eventCounts.active > 0
                                ? i18n.t('Are you sure you want to complete all active events in selection?')
                                : i18n.t('There are no active events to complete in the current selection.')
                            }
                        </span>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                secondary
                                onClick={closeDialog}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                            <Button
                                primary
                                onClick={onCompleteEvents}
                                disabled={isLoading || eventCounts.active === 0}
                                loading={isCompletingEvents}
                            >
                                {i18n.t('Complete')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}

            {isCompleteDialogOpen && validationError && (
                <BulkActionErrorModal
                    title={i18n.t('Error completing events')}
                    introText={i18n.t('There was an error completing the events.')}
                    errorReports={validationError.validationReport.errorReports}
                    getRecordHref={getRecordHref}
                    onClose={closeDialog}
                    dataTest="bulk-complete-events-dialog"
                />
            )}
        </>
    );
};

export const CompleteAction = withStyles(styles)(CompleteActionPlain) as ComponentType<Props>;
