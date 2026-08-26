import React, { useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconDelete24, colors } from '@dhis2/ui';
import { EventWorkingListsUpdateTrigger } from '../UpdateTrigger';
import type { CustomRowMenuContents } from '../../WorkingListsBase';
import type { Props } from './eventWorkingListsRowMenuSetup.types';
import { useProgramExpiryForUser } from '../../../../hooks';
import { isValidPeriod } from '../../../../utils/validation/validators/form';
import { DeleteEventModal } from './DeleteEventModal';


export const EventWorkingListsRowMenuSetup = ({ onDeleteEvent, programId, ...passOnProps }: Props) => {
    const expiryPeriod = useProgramExpiryForUser(programId);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [eventIdToDelete, setEventIdToDelete] = useState<string | null>(null);

    const handleOpenDeleteModal = (eventId: string) => {
        setEventIdToDelete(eventId);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setEventIdToDelete(null);
    };

    const handleConfirmDelete = (eventId: string) => {
        onDeleteEvent(eventId);
    };

    const customRowMenuContents: CustomRowMenuContents = useMemo(() => [{
        key: 'deleteEventItem',
        clickHandler: ({ id }) => handleOpenDeleteModal(id),
        icon: <IconDelete24 color={colors.red400} />,
        label: i18n.t('Delete event'),
        tooltipContent: (row) => {
            const { occurredAt } = row ?? {};
            const { isWithinValidPeriod } = isValidPeriod(occurredAt, expiryPeriod);
            return isWithinValidPeriod ? null : i18n.t(
                '{{occurredAt}} belongs to an expired period. Event cannot be deleted',
                {
                    occurredAt,
                    interpolation: { escapeValue: false },
                },
            );
        },
        tooltipEnabled: (row) => {
            const { occurredAt } = row ?? {};
            const { isWithinValidPeriod } = isValidPeriod(occurredAt, expiryPeriod);
            return !isWithinValidPeriod;
        },
        disabled: (row) => {
            const { occurredAt } = row ?? {};
            const { isWithinValidPeriod } = isValidPeriod(occurredAt, expiryPeriod);
            return !isWithinValidPeriod;
        },
    }], [expiryPeriod]);


    return (
        <>
            <EventWorkingListsUpdateTrigger
                {...passOnProps}
                programId={programId}
                customRowMenuContents={customRowMenuContents}
            />
            {deleteModalOpen && eventIdToDelete && (
                <DeleteEventModal
                    eventId={eventIdToDelete}
                    onClose={handleCloseDeleteModal}
                    onConfirmDelete={handleConfirmDelete}
                />
            )}
        </>
    );
};
