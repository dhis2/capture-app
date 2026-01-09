import * as React from 'react';
import { useState, useEffect, type ComponentType } from 'react';
import moment from 'moment';
import { Editor, Parser } from '@dhis2/d2-ui-rich-text';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
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

const styles = {
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
        width: '30px',
        height: '30px',
    },
    borderBoxContent: {
        margin: '10px',
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
    notesContainer: {},
    newNoteContainer: {},
    newNoteFormContainer: {},
    inputContainer: {},
} as const;

type Props = {
    notes: Array<Note>;
    onAddNote: (value: string) => void;
    onBlur: (value: string | null, options: any) => void;
    value: string | null;
    entityAccess?: { read: boolean; write: boolean };
    smallMainButton?: boolean;
};

type NotesProps = Props & WithStyles<typeof styles>;

const NotesPlain = ({
    notes,
    onAddNote,
    onBlur,
    value: propValue,
    entityAccess = { read: true, write: true },
    smallMainButton,
    classes,
}: NotesProps) => {
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

    const handleChange = (value: string | null) => {
        setInputValue(value || '');
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
                                            <Tooltip content={convertClientToList(
                                                moment(fromServerDate(n.storedAt).getClientZonedISOString()).toISOString(),
                                                dataElementTypes.DATETIME,
                                            )}
                                            >
                                                {moment(fromServerDate(n.storedAt)).fromNow()}
                                            </Tooltip>
                                        </span>

                                    </div>
                                </div>
                                <div data-test="note-text">
                                    <Parser>{n.value}</Parser>
                                </div>
                            </>}
                            suffix={null}
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

export const Notes = withStyles(styles)(NotesPlain) as ComponentType<Props>;
