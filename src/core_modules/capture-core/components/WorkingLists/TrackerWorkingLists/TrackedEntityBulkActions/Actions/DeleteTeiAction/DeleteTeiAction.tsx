import React, { useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { useAuthority } from '../../../../../../utils/userInfo/useAuthority';
import { useLocationQuery } from '../../../../../../utils/routing';
import { useCascadeDeleteTei } from './hooks/useCascadeDeleteTei';
import {
    BulkActionConfirmModal,
} from '../../../../WorkingListsCommon/BulkActionBar/BulkActionConfirmModal';
import {
    BulkActionErrorModal,
} from '../../../../WorkingListsCommon/BulkActionBar/BulkActionErrorModal';
import { createTeiErrorHrefResolver } from '../../../../WorkingListsCommon/BulkActionBar/utils';
import type { PlainProps } from './DeleteTeiAction.types';

const CASCADE_DELETE_TEI_AUTHORITY = 'F_TEI_CASCADE_DELETE';

// TODO - Add program and TEType access checks before adding action to prod
export const DeleteTeiAction = ({
    selectedRows,
    selectedRowsCount,
    trackedEntityName,
    onUpdateList,
    programId,
}: PlainProps) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { hasAuthority } = useAuthority({ authority: CASCADE_DELETE_TEI_AUTHORITY });
    const { orgUnitId } = useLocationQuery();

    const {
        mutate: deleteTeis,
        isPending,
        validationError,
        reset,
    } = useCascadeDeleteTei({
        selectedRows,
        active: isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        onUpdateList,
    });

    const getRecordHref = useMemo(
        () => createTeiErrorHrefResolver({
            programId,
            orgUnitId,
            knownTeiUids: new Set(Object.keys(selectedRows)),
        }),
        [programId, orgUnitId, selectedRows],
    );

    const closeModal = () => {
        setIsDeleteDialogOpen(false);
        reset();
    };

    if (!hasAuthority) {
        return null;
    }

    return (
        <>
            <Button
                small
                onClick={() => setIsDeleteDialogOpen(true)}
            >
                {i18n.t('Delete {{ trackedEntityName }} with all enrollments', {
                    trackedEntityName: trackedEntityName.toLowerCase(),
                })}
            </Button>

            {isDeleteDialogOpen && !validationError && (
                <BulkActionConfirmModal
                    title={i18n.t('Delete {{count}} {{ trackedEntityName }}', {
                        count: selectedRowsCount,
                        trackedEntityName: trackedEntityName.toLowerCase(),
                        defaultValue: 'Delete {{count}} {{ trackedEntityName }}',
                        defaultValue_plural: 'Delete {{count}} {{ trackedEntityName }}',
                    })}
                    confirmLabel={i18n.t('Delete')}
                    onConfirm={() => deleteTeis()}
                    onCancel={closeModal}
                    isPending={isPending}
                >
                    {i18n.t('Deleting records will also delete any associated enrollments and events.')}
                    {' '}
                    {i18n.t('This cannot be undone.')}
                    {' '}
                    {i18n.t('Are you sure you want to delete?')}
                </BulkActionConfirmModal>
            )}

            {isDeleteDialogOpen && validationError && (
                <BulkActionErrorModal
                    title={i18n.t('Error deleting {{ trackedEntityName }}', {
                        trackedEntityName: trackedEntityName.toLowerCase(),
                    })}
                    introText={i18n.t(
                        'There was an error while deleting the records. Please see the details below.',
                    )}
                    errorReports={validationError.validationReport.errorReports}
                    getRecordHref={getRecordHref}
                    onClose={closeModal}
                />
            )}
        </>
    );
};
