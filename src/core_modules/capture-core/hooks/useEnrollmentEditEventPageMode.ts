import { useSelector } from 'react-redux';
import { useMemo, useRef } from 'react';
import { dataEntryKeys } from 'capture-core/constants';
import { statusTypes } from '../events/statusTypes';
import { useLocationQuery } from '../utils/routing';

export const useEnrollmentEditEventPageMode = (eventStatus?: string) => {
    const showEditEvent = useSelector(({ viewEventPage }: any) => viewEventPage?.eventDetailsSection?.showEditEvent);
    const { initMode } = useLocationQuery();

    // Once the event has loaded, remember whether it landed as SKIPPED. That way
    // unskipping doesn't auto-flip the user into EDIT mode via the SCHEDULE rule
    // below — they stay in VIEW until they press the Edit button themselves.
    const initialStatusRef = useRef<string | undefined>();
    if (initialStatusRef.current === undefined && eventStatus !== undefined) {
        initialStatusRef.current = eventStatus;
    }
    const landedAsSkipped = initialStatusRef.current === statusTypes.SKIPPED;

    return useMemo(() => {
        if (initMode) {
            return { currentPageMode: initMode };
        }
        if (landedAsSkipped) {
            return { currentPageMode: showEditEvent ? dataEntryKeys.EDIT : dataEntryKeys.VIEW };
        }
        if (eventStatus === statusTypes.SCHEDULE || eventStatus === statusTypes.OVERDUE) {
            return { currentPageMode: dataEntryKeys.EDIT };
        }
        return { currentPageMode: showEditEvent ? dataEntryKeys.EDIT : dataEntryKeys.VIEW };
    }, [initMode, showEditEvent, eventStatus, landedAsSkipped]);
};
