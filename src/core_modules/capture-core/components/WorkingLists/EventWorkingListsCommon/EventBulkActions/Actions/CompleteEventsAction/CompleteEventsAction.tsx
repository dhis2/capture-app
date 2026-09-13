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
import type { EventBulkActionProps } from '../../../../WorkingListsCommon/BulkActionBar/types';
import { useLocationQuery } from '../../../../../../utils/routing';

type Props = EventBulkActionProps;

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

const CompleteEventsActionPlain = ({
    selectedRows,
    stageDataWriteAccess,
    bulkDataEntryIsActive,
    removeRowsFromSelection,
    onUpdateList,
    programId,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { orgUnitId } = useLocationQuery();
    const disabled = !stageDataWriteAccess || Boolean(bulkDataEntryIsActive);
    const tooltipContent = getTooltipContent(stageDataWriteAccess, bulkDataEntryIsActive);
    const {
        completeEvents,
        eventCounts,
        isPending,
        isLoading,
        validationError,
    } = useBulkCompleteEvents({
        selectedRows,
        isModalOpen,
        setIsModalOpen,
        removeRowsFromSelection,
        onUpdateList,
        programId,
    });

    const getRecordHref = useMemo(
        () => createEventErrorHrefResolver({
            programId,
            orgUnitId,
        }),
        [programId, orgUnitId],
    );

    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <ConditionalTooltip
                enabled={disabled}
                content={tooltipContent}
            >
                <Button
                    small
                    onClick={() => setIsModalOpen(true)}
                    disabled={disabled}
                >
                    {i18n.t('Complete')}
                </Button>
            </ConditionalTooltip>

            {isModalOpen && eventCounts && !validationError && (
                <Modal
                    small
                    onClose={() => setIsModalOpen(false)}
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
                                onClick={() => setIsModalOpen(false)}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                            <Button
                                primary
                                onClick={completeEvents}
                                disabled={isLoading || eventCounts.active === 0}
                                loading={isPending}
                            >
                                {i18n.t('Complete')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}

            {isModalOpen && validationError && (
                <BulkActionErrorModal
                    title={i18n.t('Error completing events')}
                    introText={i18n.t('There was an error completing the events.')}
                    errorReports={validationError.validationReport.errorReports}
                    getRecordHref={getRecordHref}
                    onClose={closeModal}
                    dataTest="bulk-complete-events-dialog"
                />
            )}
        </>
    );
};

export const CompleteEventsAction = withStyles(styles)(CompleteEventsActionPlain) as ComponentType<Props>;
