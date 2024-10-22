// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { useAuthority } from '../../../../../../utils/userInfo/useAuthority';
import { useCascadeDeleteTei } from './hooks/useCascadeDeleteTei';

type Props = {
    selectedRows: { [id: string]: boolean },
    selectedRowsCount: number,
    trackedEntityName: string,
    onUpdateList: () => void,
}

const CASCADE_DELETE_TEI_AUTHORITY = 'F_TEI_CASCADE_DELETE';

export const DeleteTeiAction = ({
    selectedRows,
    selectedRowsCount,
    trackedEntityName,
    onUpdateList,
}: Props) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { hasAuthority } = useAuthority({ authority: CASCADE_DELETE_TEI_AUTHORITY });
    const { deleteTeis, isLoading } = useCascadeDeleteTei({
        selectedRows,
        setIsDeleteDialogOpen,
        onUpdateList,
    });

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

            {isDeleteDialogOpen && (
                <Modal
                    small
                    onClose={() => setIsDeleteDialogOpen(false)}
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
                            {i18n.t('Deleting records will also delete any associated enrollments and events. This cannot be undone. Are you sure you want to delete?')}
                        </span>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                secondary
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                            <Button
                                destructive
                                onClick={deleteTeis}
                                loading={isLoading}
                            >
                                {i18n.t('Delete')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    );
};
