import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './WidgetEventNote.types';
import { requestAddNoteForEvent } from './WidgetEventNote.actions';
import { WidgetNote } from '../WidgetNote';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import { useEnrollmentAccessContext } from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';
import { useProgramLabel, useStageLabel } from '../../metaData';

export const WidgetEventNote = ({ dataEntryKey, dataEntryId }: Props) => {
    const dispatch = useDispatch();
    const event = useStageLabel('event') ?? i18n.t('event');
    const notesTitle = useProgramLabel('note', { plural: true }) ?? i18n.t('Notes');
    const notesLower = useProgramLabel('note', { plural: true }) ?? i18n.t('notes');
    const notes = useSelector(({ dataEntriesNotes }: { dataEntriesNotes: Record<string, any[]> }) =>
        dataEntriesNotes[`${dataEntryId}-${dataEntryKey}`] ?? []);
    const {
        currentStageWriteAccess,
        trackedEntityTypeName,
        showWidgetBadge,
    } = useEnrollmentAccessContext();

    const onAddNote = (newNoteValue: string) => {
        dispatch(requestAddNoteForEvent(dataEntryKey, dataEntryId, newNoteValue));
    };

    return (
        <div data-test="event-note-widget">
            <WidgetNote
                title={i18n.t('{{notes}} about this {{event}}', {
                    notes: notesTitle,
                    event,
                    interpolation: { escapeValue: false },
                })}
                placeholder={i18n.t('Write a note about this {{event}}', {
                    event,
                    interpolation: { escapeValue: false },
                })}
                emptyNoteMessage={i18n.t('This {{event}} doesn\'t have any {{notes}}', {
                    event,
                    notes: notesLower,
                    interpolation: { escapeValue: false },
                })}
                notes={notes}
                readOnly={!currentStageWriteAccess}
                badge={showWidgetBadge ? (
                    <ReadOnlyBadge
                        programStageWriteAccess={currentStageWriteAccess}
                        trackedEntityName={trackedEntityTypeName}
                    />
                ) : null}
                onAddNote={onAddNote}
            />
        </div>
    );
};
