import React, { useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { useAuthority } from '../../../../../../utils/userInfo/useAuthority';
import { useLocationQuery } from '../../../../../../utils/routing';
import { useCascadeDeleteTei } from './hooks/useCascadeDeleteTei';
import { BulkActionErrorDetails } from '../../../../WorkingListsCommon/BulkActionBar/BulkActionErrorDetails';
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
        deleteTeis,
        isLoading,
        validationError,
        resetDeleteTeis,
    } = useCascadeDeleteTei({
        selectedRows,
        setIsDeleteDialogOpen,
        onUpdateList,
    });
    const knownTeiUids = useMemo(() => new Set(Object.keys(selectedRows)), [selectedRows]);

    const closeModal = () => {
        setIsDeleteDialogOpen(false);
        resetDeleteTeis();
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
                <Modal
                    small
                    onClose={closeModal}
                >
                    <ModalTitle>
                        {i18n.t('Delete {{count}} {{ trackedEntityName }}', {
                            count: selectedRowsCount,
                            trackedEntityName: trackedEntityName.toLowerCase(),
                            defaultValue: 'Delete {{count}} {{ trackedEntityName }}',
                            defaultValue_plural: 'Delete {{count}} {{ trackedEntityName }}',
                        })}
                    </ModalTitle>
                    <ModalContent>
                        <span>
                            {i18n.t('Deleting records will also delete any associated enrollments and events.')}
                            {' '}
                            {i18n.t('This cannot be undone.')}
                            {' '}
                            {i18n.t('Are you sure you want to delete?')}
                        </span>
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
                                // @ts-expect-error - keeping original functionality as before ts rewrite
                                onClick={deleteTeis}
                                loading={isLoading}
                            >
                                {i18n.t('Delete')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}

            {isDeleteDialogOpen && validationError && (
                <Modal
                    small
                    onClose={closeModal}
                >
                    <ModalTitle>
                        {i18n.t('Error deleting {{ trackedEntityName }}', {
                            trackedEntityName: trackedEntityName.toLowerCase(),
                        })}
                    </ModalTitle>
                    <ModalContent>
                        <BulkActionErrorDetails
                            introText={i18n.t(
                                'There was an error while deleting the records. Please see the details below.',
                            )}
                            errorReports={validationError?.validationReport?.errorReports}
                            programId={programId}
                            orgUnitId={orgUnitId}
                            knownTeiUids={knownTeiUids}
                        />
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                secondary
                                onClick={closeModal}
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
