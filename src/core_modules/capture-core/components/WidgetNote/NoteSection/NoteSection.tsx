import React, { useState, useCallback, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from '@material-ui/core';
import { withFocusSaver } from 'capture-ui';
import { Parser, Editor } from '@dhis2/d2-ui-rich-text';
import cx from 'classnames';
import { Button, Tooltip, colors, spacersNum } from '@dhis2/ui';
import moment from 'moment';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import { TextField } from '../../FormFields/New';
import { convertClientToList } from '../../../converters';
import { dataElementTypes } from '../../../metaData';
import type { OwnProps, NoteType } from './NoteSection.types';

const FocusTextField = withFocusSaver()(TextField);

const styles = {
    item: {
        padding: spacersNum.dp12,
        marginRight: spacersNum.dp4,
        background: colors.grey200,
        borderRadius: '5px',
        display: 'flex',
        fontSize: '14px',
        lineHeight: '19px',
        color: colors.grey900,
        '& + &': {
            marginTop: spacersNum.dp8,
        },
    },
    wrapper: {
        padding: `0 ${spacersNum.dp16}px`,
        marginBottom: spacersNum.dp16,
    },
    notesWrapper: {
        maxHeight: 400,
        overflowY: 'auto' as const,
    },
    editor: {
        paddingTop: spacersNum.dp16,
    },
    emptyNotes: {
        fontSize: 14,
        color: colors.grey600,
    },
    name: {
        fontSize: '13px',
        fontWeight: 500,
    },
    lastUpdated: {
        fontSize: '12px',
        marginLeft: '8px',
        color: colors.grey700,
    },
    body: {
        '& p': {
            margin: `${spacersNum.dp8}px 0 0 0`,
        },
    },
    newNoteButtonContainer: {
        paddingTop: spacersNum.dp4,
        display: 'flex',
        gap: '4px',
    },
    rightColumn: {
        flex: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    headerText: {
        display: 'inline-block',
    },
};

type Props = OwnProps & WithStyles<typeof styles>;

const NoteSectionPlain = ({
    placeholder,
    emptyNoteMessage,
    notes,
    handleAddNote,
    classes,
}: Props) => {
    const [isEditing, setEditing] = useState<boolean>(false);
    const [newNoteValue, setNewNoteValue] = useState<string>('');
    const { fromServerDate } = useTimeZoneConversion();

    const handleChange = useCallback((value: string) => {
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

    const NoteItem = ({ value, note, storedAt, createdBy }: NoteType) => (
        <div data-test="note-item" className={cx(classes.item)}>
            {/* TODO: add avatar */}
            <div className={classes.rightColumn}>
                <div className={classes.header}>
                    {createdBy && <span className={cx(classes.headerText, classes.name)}>
                        {createdBy.firstName} {' '} {createdBy.surname}
                    </span>}
                    <span className={cx(classes.headerText, classes.lastUpdated)}>
                        <Tooltip content={convertClientToList(moment(fromServerDate(storedAt).getClientZonedISOString()).toISOString(), dataElementTypes.DATETIME)}>
                            {moment(fromServerDate(storedAt)).fromNow()}
                        </Tooltip>
                    </span>
                </div>
                <div className={classes.body}>
                    <Parser>{note || value}</Parser>
                </div>
            </div>
        </div>
    );

    return (
        <div className={classes.wrapper}>
            <div className={classes.notesWrapper}>
                {notes
                    .sort((a, b) => moment(a.storedAt).valueOf() - moment(b.storedAt).valueOf())
                    .map(note => <NoteItem key={`note-item-${note.value || note.note}-`} {...note} />)
                }
                {notes.length === 0 &&
                <div className={classes.emptyNotes}>
                    {emptyNoteMessage}
                </div>}
            </div>

            <div className={classes.editor}>
                <Editor>
                    <FocusTextField
                        placeholder={placeholder}
                        onChange={handleChange}
                        value={newNoteValue}
                        data-test="note-textfield"
                    />
                </Editor>
            </div>

            {isEditing && <div className={classes.newNoteButtonContainer} data-test="note-buttons-container">
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
        </div>);
};

export const NoteSection = withStyles(styles)(NoteSectionPlain) as ComponentType<OwnProps>;
