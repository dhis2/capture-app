// @flow

import * as React from 'react';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { Editor, Parser } from '@dhis2/d2-ui-rich-text';
import { withStyles } from '@material-ui/core';
import { colors, spacersNum, Menu, MenuItem, Button, Tooltip } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { withFocusSaver } from 'capture-ui';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { TextField } from '../FormFields/New';
import { convertClientToList } from '../../converters';
import { dataElementTypes } from '../../metaData';
import type { Note } from './notes.types';


const FocusTextField = withFocusSaver()(TextField);

const styles = theme => ({
    noteItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'normal',
        cursor: 'default !important',
        padding: spacersNum.dp12,
        marginRight: spacersNum.dp4,
        backgroundColor: '#f3f5f7 !important',
        borderRadius: '5px',
        fontSize: '14px',
        lineHeight: '19px',
        color: colors.grey900,
        marginBottom: spacersNum.dp8,
    },
    commandButton: {
        width: theme.typography.pxToRem(30),
        height: theme.typography.pxToRem(30),
    },
    borderBoxContent: {
        margin: theme.typography.pxToRem(10),
    },
    newNoteButtonsContainer: {
        marginTop: spacersNum.dp4,
    },
    noteItemHeader: {
        display: 'flex',
    },
    noteItemUser: {
        flexGrow: 1,
        fontSize: '13px',
        fontWeight: 500,
    },
    noteItemDate: {
        color: '#4a5768',
    },
    notesList: {
        padding: 0,
    },
    addNoteContainer: {
        marginRight: 5,
        marginLeft: 2,
    },
});

type Props = {
    notes: Array<Note>,
    onAddNote: (value: string) => void,
    onBlur: (value: ?string, options: any) => void,
    value: ?string,
    entityAccess: { read: boolean, write: boolean },
    smallMainButton: boolean,
    classes: {
        noteItem: string,
        inputContainer: string,
        borderBoxContent: string,
        newNoteButtonsContainer: string,
        newNoteContainer: string,
        newNoteFormContainer: string,
        textEditorContainer: string,
        notesContainer: string,
        noteItemHeader: string,
        noteItemUser: string,
        noteItemDate: string,
        notesList: string,
        addNoteContainer: string,
    },
};

const NotesPlain = ({
    notes,
    onAddNote,
    onBlur,
    value: propValue,
    entityAccess = { read: true, write: true },
    smallMainButton,
    classes,
}: Props) => {
    const [addIsOpen, setAddIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const { fromServerDate } = useTimeZoneConversion();

    useEffect(() => {
        setAddIsOpen(!!propValue);
        setInputValue(propValue || '');
    }, [propValue]);

    const toggleIsOpen = () => {
        setAddIsOpen(prev => !prev);
    };

    const onCancel = () => {
        onBlur(null, { touched: false });
        toggleIsOpen();
    };

    const onNewNoteEditorBlur = (value: string) => {
        onBlur(value, { touched: false });
    };

    const handleAddNote = () => {
        if (propValue) {
            onAddNote(propValue);
        }
        toggleIsOpen();
        onBlur(null, { touched: false });
    };

    const handleChange = (value: ?string) => {
        setInputValue(value);
    };

    const renderInput = () => (
        <div className={classes.newNoteFormContainer}>
            <Editor onEdit={handleChange}>
                <FocusTextField
                    onBlur={onNewNoteEditorBlur}
                    onChange={handleChange}
                    value={inputValue}
                    multiLine
                    data-test="note-textfield"
                />
            </Editor>
            <div className={classes.newNoteButtonsContainer} data-test="note-buttons-container">
                <Button
                    dataTest="add-note-btn"
                    onClick={handleAddNote}
                    className={classes.addNoteContainer}
                    primary
                    small
                >
                    {i18n.t('Add note')}
                </Button>
                <Button
                    onClick={onCancel}
                    secondary
                    small
                >
                    {i18n.t('Cancel')}
                </Button>
            </div>

        </div>
    );


    const renderButton = (canAddNote: boolean) => (
        <div data-test="new-note-button">
            <ConditionalTooltip
                content={i18n.t('You don\'t have access to write notes')}
                enabled={!canAddNote}
            >
                <Button
                    onClick={toggleIsOpen}
                    disabled={!canAddNote}
                    // eslint-disable-next-line indent
                    small={smallMainButton}
                    dataTest="write-note-btn"
                >
                    {i18n.t('Write note')}
                </Button>
            </ConditionalTooltip>
        </div>
    );

    return (
        <div className={classes.notesContainer}>
            <Menu dense className={classes.notesList} dataTest="notes-list">
                {notes.map(n =>
                    (
                        <MenuItem
                            className={classes.noteItem}
                            key={n.clientId}
                            dataTest="note-item"
                            label={<>
                                <div className={classes.noteItemHeader}>
                                    <div className={classes.noteItemUser} data-test="note-user">
                                        {n.createdBy ?
                                            `${n.createdBy.firstName} ${n.createdBy.surname}`
                                            : `${n.storedBy}` }
                                    </div>
                                    <div className={classes.noteItemDate} data-test="note-date">
                                        <span>
                                            <Tooltip content={convertClientToList(moment(fromServerDate(n.storedAt).getClientZonedISOString()).toISOString(), dataElementTypes.DATETIME)}>
                                                {moment(fromServerDate(n.storedAt)).fromNow()}
                                            </Tooltip>
                                        </span>

                                    </div>
                                </div>
                                <div data-test="note-text">
                                    <Parser>{n.value}</Parser>
                                </div>
                            </>}
                        />
                    ),
                )}
            </Menu>
            <div className={classes.newNoteContainer} data-test="new-note-container">
                {addIsOpen ? renderInput() : renderButton(entityAccess.write)}
            </div>
        </div>
    );
};

export const Notes = withStyles(styles)(NotesPlain);
