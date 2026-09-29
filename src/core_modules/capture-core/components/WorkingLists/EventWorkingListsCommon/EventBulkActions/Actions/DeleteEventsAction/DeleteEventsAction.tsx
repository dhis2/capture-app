import React, { useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import {
    BulkActionErrorModal,
} from '../../../../WorkingListsCommon/BulkActionBar/BulkActionErrorModal';
import { createEventErrorHrefResolver } from '../../../../WorkingListsCommon/BulkActionBar/utils';
import { useLocationQuery } from '../../../../../../utils/routing';
import { useBulkDeleteEvents } from './useBulkDeleteEvents';
import { LabelKeys, useTermLabel } from '../../../../../../customLabels';
import type { EventBulkActionProps } from '../../../../WorkingListsCommon/BulkActionBar/types';

type Props = EventBulkActionProps;

const getTooltipContent = (
    stageDataWriteAccess?: boolean,
    bulkDataEntryIsActive?: boolean,
    eventsLabel?: string,
) => {
    if (!stageDataWriteAccess) {
        return i18n.t('You do not have access to delete {{eventsLabel}}', { eventsLabel });
    }
    if (bulkDataEntryIsActive) {
        return i18n.t('There is a bulk data entry with unsaved changes');
    }
    return '';
};

export const DeleteEventsAction = ({
    selectedRows,
    stageDataWriteAccess,
    bulkDataEntryIsActive,
    onUpdateList,
    removeRowsFromSelection,
    programId,
    stageId,
}: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { orgUnitId } = useLocationQuery();
    const { eventsLabel } = useTermLabel([LabelKeys.eventPlural], { stageId });
    const tooltipContent = getTooltipContent(stageDataWriteAccess, bulkDataEntryIsActive, eventsLabel);
    const disabled = !stageDataWriteAccess || Boolean(bulkDataEntryIsActive);

    const {
        deleteEvents,
        isPending,
        validationError,
    } = useBulkDeleteEvents({
        selectedRows,
        eventsLabel,
        isModalOpen,
        onUpdateList,
        removeRowsFromSelection,
        setIsModalOpen,
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
                    {i18n.t('Delete')}
                </Button>
            </ConditionalTooltip>

            {isModalOpen && !validationError && (
                <Modal
                    small
                    onClose={closeModal}
                    dataTest="bulk-delete-events-dialog"
                >
                    <ModalTitle>{i18n.t('Delete {{eventsLabel}}', { eventsLabel })}</ModalTitle>
                    <ModalContent>
                        {i18n.t('This cannot be undone.')}
                        {' '}
                        {i18n.t(
                            'Are you sure you want to delete the selected {{eventsLabel}}?',
                            { eventsLabel },
                        )}
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                secondary
                                onClick={closeModal}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                            <Button
                                destructive
                                onClick={() => deleteEvents()}
                                loading={isPending}
                            >
                                {i18n.t('Delete')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}

            {isModalOpen && validationError && (
                <BulkActionErrorModal
                    title={i18n.t('Error deleting {{eventsLabel}}', { eventsLabel })}
                    introText={i18n.t(
                        'There was an error while deleting the {{eventsLabel}}. Please see the details below.',
                        { eventsLabel },
                    )}
                    errorReports={validationError.validationReport.errorReports}
                    getRecordHref={getRecordHref}
                    onClose={closeModal}
                    dataTest="bulk-delete-events-dialog"
                />
            )}
        </>
    );
};
