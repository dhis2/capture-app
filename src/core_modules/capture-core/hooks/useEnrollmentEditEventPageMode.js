// @flow
import { useSelector } from 'react-redux';
import { statusTypes } from '../events/statusTypes';

const pageMode = Object.freeze({
    EDIT: 'editEvent',
    VIEW: 'viewEvent',
});

export const useEnrollmentEditEventPageMode = (eventStatus?: string) => {
    const showEditEvent = useSelector(({ viewEventPage }) => viewEventPage?.eventDetailsSection?.showEditEvent);

    if (eventStatus === statusTypes.SCHEDULE || eventStatus === statusTypes.OVERDUE) {
        return { currentPageMode: pageMode.EDIT, pageMode, cancel: showEditEvent === false };
    }
    return { currentPageMode: showEditEvent ? pageMode.EDIT : pageMode.VIEW, pageMode, cancel: false };
};
