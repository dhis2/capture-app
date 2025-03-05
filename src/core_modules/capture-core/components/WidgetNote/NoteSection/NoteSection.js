// @flow
import React, { useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withFocusSaver } from 'capture-ui';
import { Parser, Editor } from '@dhis2/d2-ui-rich-text';
import { colors, spacersNum, Button, Tooltip } from '@dhis2/ui';
import moment from 'moment';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { TextField } from '../../FormFields/New';
import { convertClientToList } from '../../../converters';
import { dataElementTypes } from '../../../metaData';

const FocusTextField = withFocusSaver()(TextField);

type Props = {
    notes: Array<Object>,
    handleAddNote: (text: string) => void,
    placeholder: string,
    emptyNoteMessage: string,
}

export const NoteSection = ({
    placeholder,
    emptyNoteMessage,
    notes,
    handleAddNote,
}: Props) => {
    const [isEditing, setEditing] = useState(false);
    const [newNoteValue, setNewNoteValue] = useState('');
    const { fromServerDate } = useTimeZoneConversion();

    const handleChange = useCallback((value) => {
        setEditing(true);
        setNewNoteValue(value);
    }, []);

    const onCancel = useCallback(() => {
        setNewNoteValue('');
        setEditing(false);
    }, []);

    const onAddNote = useCallback(() => {
        handleAddNote(newNoteValue);
        setNewNoteValue('');
        setEditing(false);
    }, [handleAddNote, newNoteValue]);

    const NoteItem = ({ value, storedAt, createdBy }) => (
        <div data-test="note-item" className="item">
            {/* TODO: add avatar */}
            <div className="right-column">
                <div className="header">
                    {createdBy && <span className="name">
                        {createdBy.firstName} {' '} {createdBy.surname}
                    </span>}
                    <span className="last-updated">
                        <Tooltip content={convertClientToList(moment(fromServerDate(storedAt).getClientZonedISOString()).toISOString(), dataElementTypes.DATETIME)}>
                            {moment(fromServerDate(storedAt)).fromNow()}
                        </Tooltip>
                    </span>
                </div>
                <div className="body">
                    <Parser>{value}</Parser>
                </div>
            </div>
            <style jsx>{`
                .item {
                    padding: ${spacersNum.dp12}px;
                    margin-right: ${spacersNum.dp4}px;
                    background: ${colors.grey200};
                    border-radius: 5px;
                    display: flex;
                    font-size: 14px;
                    line-height: 19px;
                    color: ${colors.grey900};
                }
                .item + .item {
                    margin-top: ${spacersNum.dp8}px;
                }
                .name {
                    font-size: 13px;
                    font-weight: 500;
                }
                .last-updated {
                    font-size: 12px;
                    margin-left: 8px;
                    color: ${colors.grey700};
                }
                .body :global(p) {
                    margin: ${spacersNum.dp8}px 0 0 0;
                }
            `}</style>
        </div>
    );


    return (
        <div className="wrapper">
            <div className="notes-wrapper">
                {notes
                    .sort((a, b) => moment(a.storedAt).valueOf() - moment(b.storedAt).valueOf())
                    .map(note => <NoteItem key={`note-item-${note.note}-`} {...note} />)
                }
                {notes.length === 0 &&
                <div className="empty-notes">
                    {emptyNoteMessage}
                </div>}
            </div>

            <div className="editor">
                <Editor>
                    <FocusTextField
                        placeholder={placeholder}
                        onChange={handleChange}
                        value={newNoteValue}
                        data-test="note-textfield"
                    />
                </Editor>
            </div>

            {isEditing && <div className="new-note-button-container" data-test="note-buttons-container">
                <Button
                    dataTest="add-note-btn"
                    onClick={onAddNote}
                    primary
                >
                    {i18n.t('Save note')}
                </Button>
                <Button
                    dataTest="cancel-note-btn"
                    onClick={onCancel}
                >
                    {i18n.t('Cancel')}
                </Button>
            </div>}

            <style jsx>{`
                .wrapper {
                    padding: 0 ${spacersNum.dp16}px;
                    margin-bottom: ${spacersNum.dp16}px;
                }
                .notes-wrapper {
                    max-height: 400px;
                    overflow-y: auto;
                }
                .editor {
                    padding-top: ${spacersNum.dp16}px;
                }
                .empty-notes {
                    font-size: 14px;
                    color: ${colors.grey600};
                }
                .new-note-button-container {
                    padding-top: ${spacersNum.dp4}px;
                    display: flex;
                    gap: 4px;
                }
            `}</style>
        </div>
    );
};

