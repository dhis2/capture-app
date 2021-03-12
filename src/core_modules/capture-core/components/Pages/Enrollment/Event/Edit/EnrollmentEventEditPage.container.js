// @flow
import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EnrollmentEventEditPageComponent } from './EnrollmentEventEditPage.component';
import { fetchEventInformation } from './EnrollmentEventEditPage.actions';
import type { EnrollmentPageStatus } from '../../EnrollmentPage.types';


export const EnrollmentEventEditPage: ComponentType<{||}> = () => {
    const dispatch = useDispatch();

    const error: boolean =
    useSelector(({ activePage }) => activePage.selectionsError && activePage.selectionsError.error);
    const selectedEventId: string =
      useSelector(({ router: { location: { query } } }) => query.eventId);
    const pageStatus: EnrollmentPageStatus =
      useSelector(({ enrollmentEventEditPage }) => enrollmentEventEditPage.pageStatus);


    useEffect(() => {
        dispatch(fetchEventInformation());
    },
    [
        selectedEventId,
        dispatch,
    ]);

    return (
        <EnrollmentEventEditPageComponent
            error={error}
            pageStatus={pageStatus}
        />
    );
};
