// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import { useAuthority } from '../../../../../../utils/userInfo/useAuthority';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import { useCascadeDeleteTei } from './hooks/useCascadeDeleteTei';

type Props = {
    selectedRows: { [id: string]: boolean },
    selectedRowsCount: number,
    onUpdateList: () => void,
}

const CASCADE_DELETE_TEI_AUTHORITY = 'F_TEI_CASCADE_DELETE';

export const DeleteAction = ({
    selectedRows,
    selectedRowsCount,
    onUpdateList,
}: Props) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { hasAuthority } = useAuthority({ authority: CASCADE_DELETE_TEI_AUTHORITY });
    const { deleteTeis, isLoading } = useCascadeDeleteTei({
        selectedRows,
        setIsDeleteDialogOpen,
        onUpdateList,
    });

    return (
        <>
            <ConditionalTooltip
                enabled={!hasAuthority}
                content={i18n.t('You do not have the required authority to delete tracked entities')}
            >
                <Button
                    small
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={!hasAuthority}
                >
                    {i18n.t('Delete {{ trackedEntityName }} with all enrollments', {
                        trackedEntityName: 'Person'.toLowerCase(),
                    })}
                </Button>
            </ConditionalTooltip>

            {isDeleteDialogOpen && (
                <Modal
                    small
                    onClose={() => setIsDeleteDialogOpen(false)}
                >
                    <ModalTitle>
                        {i18n.t('Delete {{count}} {{ trackedEntityName }}', {
                            count: selectedRowsCount,
                            trackedEntityName: 'Person'.toLowerCase(),
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
