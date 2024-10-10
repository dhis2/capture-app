// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
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

            {isCompleteDialogOpen && eventCounts && (
                <Modal
                    small
                    onClose={() => setIsCompleteDialogOpen(false)}
                    dataTest={'bulk-complete-events-dialog'}
                >
                    <ModalTitle>
                        {i18n.t('Complete events')}
                    </ModalTitle>

                    <ModalContent>
                        {eventCounts.active > 0 ?
                            i18n.t('Are you sure you want to complete all active events?')
                            :
                            i18n.t('There are no active events to complete in the current selection.')
                        }
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
