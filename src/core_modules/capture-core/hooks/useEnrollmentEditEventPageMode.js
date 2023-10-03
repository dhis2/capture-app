// @flow
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { dataEntryKeys } from 'capture-core/constants';
import { statusTypes } from '../events/statusTypes';
import { useLocationQuery } from '../utils/routing';

export const useEnrollmentEditEventPageMode = (eventStatus?: string) => {
    const showEditEvent = useSelector(({ viewEventPage }) => viewEventPage?.eventDetailsSection?.showEditEvent);
    const { initMode } = useLocationQuery();

    return useMemo(() => {
        if (initMode) {
            return { currentPageMode: initMode };
        }

        if (eventStatus === statusTypes.SCHEDULE || eventStatus === statusTypes.OVERDUE) {
            return { currentPageMode: dataEntryKeys.EDIT };
        }
        return { currentPageMode: showEditEvent ? dataEntryKeys.EDIT : dataEntryKeys.VIEW };
    }, [initMode, showEditEvent, eventStatus]);
};
