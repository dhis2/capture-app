// @flow
import { useSelector } from 'react-redux';
import { DATA_ENTRY_KEY } from 'capture-core/constants';
import { statusTypes } from '../events/statusTypes';

export const useEnrollmentEditEventPageMode = (eventStatus?: string) => {
    const showEditEvent = useSelector(({ viewEventPage }) => viewEventPage?.eventDetailsSection?.showEditEvent);

    if (eventStatus === statusTypes.SCHEDULE || eventStatus === statusTypes.OVERDUE) {
        return { currentPageMode: DATA_ENTRY_KEY.edit };
    }
    return { currentPageMode: showEditEvent ? DATA_ENTRY_KEY.edit : DATA_ENTRY_KEY.view };
};
