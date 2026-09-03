import i18n from '@dhis2/d2-i18n';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestAddNoteForEnrollment } from './WidgetEnrollmentNote.actions';
import { WidgetNote } from '../WidgetNote';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import { useEnrollmentAccessContext } from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';
import { useLocationQuery } from '../../utils/routing';
import { useTermLabel } from '../../metaData';

export const WidgetEnrollmentNote = () => {
    const dispatch = useDispatch();
    const { enrollmentId } = useLocationQuery();
    const notes = useSelector(({ enrollmentDomain }: { enrollmentDomain?: { enrollment?: { notes?: Array<any> } } }) =>
        enrollmentDomain?.enrollment?.notes ?? []);
    const {
        programWriteAccess,
        trackedEntityTypeName,
        showWidgetBadge,
    } = useEnrollmentAccessContext();
    const enrollmentLabel = useTermLabel('enrollment');
    const noteLabel = useTermLabel('note');
    const notesLabel = useTermLabel('note', { plural: true });

    const onAddNote = (newNoteValue: string) => {
        dispatch(requestAddNoteForEnrollment(enrollmentId, newNoteValue));
    };

    return (
        <div data-test="enrollment-note-widget">
            <WidgetNote
                title={i18n.t(
                    '{{notesLabel}} about this {{enrollmentLabel}}',
                    { notesLabel, enrollmentLabel },
                )}
                placeholder={i18n.t(
                    'Write a {{noteLabel}} about this {{enrollmentLabel}}',
                    { enrollmentLabel, noteLabel },
                )}
                emptyNoteMessage={i18n.t(
                    "This {{enrollmentLabel}} doesn't have any {{notesLabel}}",
                    { enrollmentLabel, notesLabel },
                )}
                noteLabel={noteLabel}
                notes={notes}
                readOnly={!programWriteAccess}
                badge={showWidgetBadge ? (
                    <ReadOnlyBadge
                        programWriteAccess={programWriteAccess}
                        trackedEntityName={trackedEntityTypeName}
                    />
                ) : null}
                onAddNote={onAddNote}
            />
        </div>
    );
};
