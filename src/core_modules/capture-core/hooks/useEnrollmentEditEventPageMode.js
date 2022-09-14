// @flow
import { useSelector } from 'react-redux';
import { dataEntryKeys } from 'capture-core/constants';
import { statusTypes } from '../events/statusTypes';

export const useEnrollmentEditEventPageMode = (eventStatus?: string) => {
    const showEditEvent = useSelector(({ viewEventPage }) => viewEventPage?.eventDetailsSection?.showEditEvent);

    if (eventStatus === statusTypes.SCHEDULE || eventStatus === statusTypes.OVERDUE) {
        return { currentPageMode: dataEntryKeys.EDIT };
    }
    return { currentPageMode: showEditEvent ? dataEntryKeys.EDIT : dataEntryKeys.VIEW };
};
