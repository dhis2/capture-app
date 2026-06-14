import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDispatch, useSelector } from 'react-redux';
import { requestAddNoteForEnrollment } from './WidgetEnrollmentNote.actions';
import { WidgetNote } from '../WidgetNote';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import { useEnrollmentAccessContext } from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';
import { useLocationQuery } from '../../utils/routing';
import { useProgramLabel } from '../../metaData';

export const WidgetEnrollmentNote = () => {
    const dispatch = useDispatch();
    const { enrollmentId } = useLocationQuery();
    const enrollment = useProgramLabel('enrollment') ?? i18n.t('enrollment');
    const notesTitle = useProgramLabel('note', { plural: true }) ?? i18n.t('Notes');
    const notesLower = useProgramLabel('note', { plural: true }) ?? i18n.t('notes');
    const notes = useSelector(({ enrollmentDomain }: { enrollmentDomain?: { enrollment?: { notes?: Array<any> } } }) =>
        enrollmentDomain?.enrollment?.notes ?? []);
    const {
        programWriteAccess,
        trackedEntityTypeName,
        showWidgetBadge,
    } = useEnrollmentAccessContext();

    const onAddNote = (newNoteValue: string) => {
        dispatch(requestAddNoteForEnrollment(enrollmentId, newNoteValue));
    };

    return (
        <div data-test="enrollment-note-widget">
            <WidgetNote
                title={i18n.t('{{notes}} about this {{enrollment}}', {
                    notes: notesTitle,
                    enrollment,
                    interpolation: { escapeValue: false },
                })}
                placeholder={i18n.t('Write a note about this {{enrollment}}', {
                    enrollment,
                    interpolation: { escapeValue: false },
                })}
                emptyNoteMessage={i18n.t('This {{enrollment}} doesn\'t have any {{notes}}', {
                    enrollment,
                    notes: notesLower,
                    interpolation: { escapeValue: false },
                })}
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
