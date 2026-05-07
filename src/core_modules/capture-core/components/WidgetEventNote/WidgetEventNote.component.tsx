import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './WidgetEventNote.types';
import { requestAddNoteForEvent } from './WidgetEventNote.actions';
import { WidgetNote } from '../WidgetNote';
import { useProgram } from '../WidgetEnrollment/hooks/useProgram';

export const WidgetEventNote = ({ dataEntryKey, dataEntryId, programId, stageId, hideReadOnlyBadge }: Props) => {
    const dispatch = useDispatch();
    const { program } = useProgram(programId ?? '');
    const liveStage = program?.programStages?.find((s: any) => s.id === stageId);
    const stageWriteAccess = program ? Boolean(liveStage?.access?.data?.write) : true;

    const notes = useSelector(({ dataEntriesNotes }: { dataEntriesNotes: Record<string, any[]> }) =>
        dataEntriesNotes[`${dataEntryId}-${dataEntryKey}`] ?? []);

    const onAddNote = (newNoteValue: string) => {
        dispatch(requestAddNoteForEvent(dataEntryKey, dataEntryId, newNoteValue));
    };

    return (
        <div data-test="event-note-widget">
            <WidgetNote
                title={i18n.t('Notes about this event')}
                placeholder={i18n.t('Write a note about this event')}
                emptyNoteMessage={i18n.t('This event doesn\'t have any notes')}
                notes={notes}
                onAddNote={onAddNote}
                readOnly={!stageWriteAccess}
                programStageWriteAccess={stageWriteAccess}
                hideReadOnlyBadge={hideReadOnlyBadge}
            />
        </div>
    );
};
