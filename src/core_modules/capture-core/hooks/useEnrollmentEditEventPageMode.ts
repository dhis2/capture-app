import { useSelector } from 'react-redux';
import { useMemo, useRef } from 'react';
import { dataEntryKeys } from 'capture-core/constants';
import { statusTypes } from '../events/statusTypes';
import { useLocationQuery } from '../utils/routing';

const isScheduledStatus = (status?: string) =>
    status === statusTypes.SCHEDULE || status === statusTypes.OVERDUE;

export const useEnrollmentEditEventPageMode = (eventStatus?: string, eventId?: string) => {
    const showEditEvent = useSelector(({ viewEventPage }: any) => viewEventPage?.eventDetailsSection?.showEditEvent);
    const { initMode } = useLocationQuery();

    const initialStatusRef = useRef<{ eventId?: string; status?: string }>({});
    if (eventId && eventStatus !== undefined && initialStatusRef.current.eventId !== eventId) {
        initialStatusRef.current = { eventId, status: eventStatus };
    }
    const landedAsSkipped =
        initialStatusRef.current.status === statusTypes.SKIPPED
        && eventStatus === statusTypes.SKIPPED;

    return useMemo(() => {
        if (initMode) return { currentPageMode: initMode };

        const shouldEdit = showEditEvent || (isScheduledStatus(eventStatus) && !landedAsSkipped);

        return { currentPageMode: shouldEdit ? dataEntryKeys.EDIT : dataEntryKeys.VIEW };
    }, [initMode, showEditEvent, eventStatus, landedAsSkipped]);
};
