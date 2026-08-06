import React, { useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import {
    BulkActionConfirmModal,
} from '../../../../WorkingListsCommon/BulkActionBar/BulkActionConfirmModal';
import {
    BulkActionErrorModal,
} from '../../../../WorkingListsCommon/BulkActionBar/BulkActionErrorModal';
import { createEventErrorHrefResolver } from '../../../../WorkingListsCommon/BulkActionBar/utils';
import { useLocationQuery } from '../../../../../../utils/routing';
import { useBulkDeleteEvents } from './hooks/useBulkDeleteEvents';
import type { Props } from './DeleteAction.types';

const getTooltipContent = (stageDataWriteAccess?: boolean, bulkDataEntryIsActive?: boolean) => {
    if (!stageDataWriteAccess) {
        return i18n.t('You do not have access to delete events');
    }
    if (bulkDataEntryIsActive) {
        return i18n.t('There is a bulk data entry with unsaved changes');
    }
    return '';
};

export const DeleteAction = ({
    selectedRows,
    stageDataWriteAccess,
    bulkDataEntryIsActive,
    onUpdateList,
    programId,
}: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { orgUnitId } = useLocationQuery();
    const tooltipContent = getTooltipContent(stageDataWriteAccess, bulkDataEntryIsActive);
    const disabled = !stageDataWriteAccess || Boolean(bulkDataEntryIsActive);

    const {
        mutate: deleteEvents,
        isPending,
        validationError,
        reset,
    } = useBulkDeleteEvents({
        selectedRows,
        active: isModalOpen,
        onUpdateList,
        setIsModalOpen,
    });

    const getRecordHref = useMemo(
        () => createEventErrorHrefResolver({
            programId,
            orgUnitId,
            knownEventUids: new Set(Object.keys(selectedRows)),
        }),
        [programId, orgUnitId, selectedRows],
    );

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

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
                <BulkActionConfirmModal
                    title={i18n.t('Delete events')}
                    confirmLabel={i18n.t('Delete')}
                    onConfirm={() => deleteEvents()}
                    onCancel={closeModal}
                    isPending={isPending}
                    dataTest="bulk-delete-events-dialog"
                >
                    {i18n.t('This cannot be undone.')}
                    {' '}
                    {i18n.t('Are you sure you want to delete the selected events?')}
                </BulkActionConfirmModal>
            )}

            {isModalOpen && validationError && (
                <BulkActionErrorModal
                    title={i18n.t('Error deleting events')}
                    introText={i18n.t(
                        'There was an error while deleting the events. Please see the details below.',
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
