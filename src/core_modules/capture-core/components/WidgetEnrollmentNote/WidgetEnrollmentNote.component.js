// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDispatch, useSelector } from 'react-redux';
import { requestAddNoteForEnrollment } from './WidgetEnrollmentNote.actions';
import { WidgetNote } from '../WidgetNote';
import { useLocationQuery } from '../../utils/routing';

export const WidgetEnrollmentNote = () => {
    const dispatch = useDispatch();
    const { enrollmentId } = useLocationQuery();
    const notes = useSelector(({ enrollmentDomain }) => enrollmentDomain?.enrollment?.notes ?? []);

    const onAddNote = (newNoteValue) => {
        dispatch(requestAddNoteForEnrollment(enrollmentId, newNoteValue));
    };

    return (
        <div data-test="enrollment-note-widget">
            <WidgetNote
                title={i18n.t('Notes about this enrollment')}
                placeholder={i18n.t('Write a note about this enrollment')}
                emptyNoteMessage={i18n.t('This enrollment doesn\'t have any notes')}
                notes={notes}
                onAddNote={onAddNote}
            />
        </div>
    );
};
