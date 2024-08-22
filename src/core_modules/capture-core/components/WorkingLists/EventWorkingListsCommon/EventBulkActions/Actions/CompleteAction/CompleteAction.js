// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    Button, ButtonStrip,
    DataTableCell,
    DataTableRow,
    Modal, ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui';
import { BulkActionCountTable } from '../../../../WorkingListsBase/BulkActionBar';
import { useBulkCompleteEvents } from './hooks/useBulkCompleteEvents';

type Props = {|
    selectedRows: { [key: string]: boolean },
    onUpdateList: () => void,
|}

export const CompleteAction = ({
    selectedRows,
    onUpdateList,
}: Props) => {
    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
    const {
        eventCounts,
        isLoading,
        isCompletingEvents,
        completeEvents,
    } = useBulkCompleteEvents({
        selectedRows,
        isCompleteDialogOpen,
        setIsCompleteDialogOpen,
        onUpdateList,
    });

    return (
        <>
            <Button
                small
                onClick={() => setIsCompleteDialogOpen(true)}
            >
                {i18n.t('Complete')}
            </Button>

            {isCompleteDialogOpen && (
                <Modal
                    small
                    onClose={() => setIsCompleteDialogOpen(false)}
                >
                    <ModalTitle>
                        {i18n.t('Complete events')}
                    </ModalTitle>

                    <ModalContent>
                        {i18n.t('Are you sure you want to complete all active events?')}

                        <BulkActionCountTable
                            total={eventCounts?.active}
                            isLoading={isLoading}
                        >
                            <DataTableRow>
                                <DataTableCell>
                                    {i18n.t('Active')}
                                </DataTableCell>
                                <DataTableCell align={'center'}>
                                    {eventCounts?.active}
                                </DataTableCell>
                            </DataTableRow>
                            <DataTableRow>
                                <DataTableCell>
                                    {i18n.t('Completed')}
                                </DataTableCell>
                                <DataTableCell align={'center'}>
                                    {eventCounts?.completed}
                                </DataTableCell>
                            </DataTableRow>
                        </BulkActionCountTable>
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
                                onClick={completeEvents}
                                disabled={isLoading || eventCounts?.active === 0 || !eventCounts}
                                loading={isCompletingEvents}
                            >
                                {i18n.t('Complete')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>

                </Modal>
            )}
        </>
    );
};
