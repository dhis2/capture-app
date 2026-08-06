import { useSelector } from 'react-redux';
import { useMemo, useRef } from 'react';
import { dataEntryKeys } from 'capture-core/constants';
import { statusTypes } from '../events/statusTypes';
import { useLocationQuery } from '../utils/routing';

const isScheduledStatus = (status?: string) =>
    status === statusTypes.SCHEDULE || status === statusTypes.OVERDUE;

export const useEnrollmentEditEventPageMode = (eventStatus?: string) => {
    const showEditEvent = useSelector(({ viewEventPage }: any) => viewEventPage?.eventDetailsSection?.showEditEvent);
    const { initMode } = useLocationQuery();

    const initialStatusRef = useRef<string>();
    if (initialStatusRef.current === undefined && eventStatus !== undefined) {
        initialStatusRef.current = eventStatus;
    }
    const landedAsSkipped = initialStatusRef.current === statusTypes.SKIPPED;

    return useMemo(() => {
        if (initMode) return { currentPageMode: initMode };

        const shouldEdit = showEditEvent || (isScheduledStatus(eventStatus) && !landedAsSkipped);

        return { currentPageMode: shouldEdit ? dataEntryKeys.EDIT : dataEntryKeys.VIEW };
    }, [initMode, showEditEvent, eventStatus, landedAsSkipped]);
};
