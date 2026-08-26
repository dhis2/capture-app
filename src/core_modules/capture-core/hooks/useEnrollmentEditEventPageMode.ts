import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { dataEntryKeys } from 'capture-core/constants';
import { statusTypes } from '../events/statusTypes';
import { useLocationQuery } from '../utils/routing';

const isScheduledStatus = (status?: string) =>
    status === statusTypes.SCHEDULE || status === statusTypes.OVERDUE;

const initialStatusPerEvent = new Map<string, string>();

export const useEnrollmentEditEventPageMode = (eventStatus?: string, eventId?: string) => {
    const showEditEvent = useSelector(({ viewEventPage }: any) => viewEventPage?.eventDetailsSection?.showEditEvent);
    const { initMode } = useLocationQuery();

    if (eventId && eventStatus !== undefined && !initialStatusPerEvent.has(eventId)) {
        initialStatusPerEvent.set(eventId, eventStatus);
    }
    const initialStatus = eventId ? initialStatusPerEvent.get(eventId) : eventStatus;
    const landedAsSkipped = initialStatus === statusTypes.SKIPPED;

    return useMemo(() => {
        if (initMode) return { currentPageMode: initMode };

        const shouldEdit = showEditEvent || (isScheduledStatus(eventStatus) && !landedAsSkipped);

        return { currentPageMode: shouldEdit ? dataEntryKeys.EDIT : dataEntryKeys.VIEW };
    }, [initMode, showEditEvent, eventStatus, landedAsSkipped]);
};
