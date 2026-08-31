import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestAddNoteForEnrollment } from './WidgetEnrollmentNote.actions';
import { WidgetNote } from '../WidgetNote';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import { useEnrollmentAccessContext } from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';
import { useLocationQuery } from '../../utils/routing';
import { useTermLabel } from '../../metaData';
import { tCustomTerm } from '../../utils/tCustomTerm';

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

    const onAddNote = (newNoteValue: string) => {
        dispatch(requestAddNoteForEnrollment(enrollmentId, newNoteValue));
    };

    return (
        <div data-test="enrollment-note-widget">
            <WidgetNote
                title={tCustomTerm('Notes about this {{enrollmentLabel}}', { enrollmentLabel })}
                placeholder={tCustomTerm('Write a note about this {{enrollmentLabel}}', { enrollmentLabel })}
                emptyNoteMessage={tCustomTerm("This {{enrollmentLabel}} doesn't have any notes", { enrollmentLabel })}
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
