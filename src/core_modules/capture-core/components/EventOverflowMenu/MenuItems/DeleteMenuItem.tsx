import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, IconDelete16, MenuItem } from '@dhis2/ui';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { DeleteActionModal } from './DeleteEventModal';

type Props = {
    eventId: string;
    pendingApiResponse: boolean;
    eventDetails: ApiEnrollmentEvent;
    onDeleteEvent: (eventId: string) => void;
    onRollbackDeleteEvent: (event: ApiEnrollmentEvent) => void;
    onClose: () => void;
};

export const DeleteMenuItem = ({
    eventId,
    pendingApiResponse,
    eventDetails,
    onDeleteEvent,
    onRollbackDeleteEvent,
    onClose,
}: Props) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <MenuItem
                dense
                icon={<IconDelete16 color={colors.red600} />}
                label={i18n.t('Delete')}
                dataTest="stages-and-events-delete"
                onClick={() => {
                    setModalOpen(true);
                    onClose();
                }}
                suffix={null}
            />
            {modalOpen && (
                <DeleteActionModal
                    eventId={eventId}
                    pendingApiResponse={pendingApiResponse}
                    eventDetails={eventDetails}
                    onDeleteEvent={onDeleteEvent}
                    onRollbackDeleteEvent={onRollbackDeleteEvent}
                    setDeleteModalOpen={setModalOpen}
                />
            )}
        </>
    );
};
