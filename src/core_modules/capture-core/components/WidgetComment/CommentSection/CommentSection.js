// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { withFocusSaver } from 'capture-ui';
import { Parser, Editor } from '@dhis2/d2-ui-rich-text';
import cx from 'classnames';
import { colors, spacersNum, Button } from '@dhis2/ui';
import moment from 'moment';
import { TextField } from '../../FormFields/New';

const FocusTextField = withFocusSaver()(TextField);

type Props = {
    notes: Array<Object>,
    newNoteValue: string,
    onEdit: () => void,
    handleAddNote: (text: string) => void,
    handleChange: (text: string) => void,
    onCancel: () => void,
    onNewNoteEditorBlur: () => void,
    ...CssClasses
}

const styles = {
    item: {
        '&:not(:first-child)': {
            marginTop: spacersNum.dp16,
        },
        padding: '12px',
        background: '#F3F5F7',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: spacersNum.dp16,
    },
    wrapper: {
        marginLeft: spacersNum.dp16,
        marginRight: spacersNum.dp16,
        paddingBottom: spacersNum.dp24,
    },
    headerText: {
        color: colors.grey900,
        fontWeight: 500,
    },
    name: {
        fontSize: '14px',
    },
    lastUpdated: {
        fontSize: '12px',
        marginLeft: '12px',
    },
    body: {
        marginTop: '4px',
    },
    avatar: {
        width: spacersNum.dp24,
    },
    rightColumn: {
        paddingLeft: spacersNum.dp8,
    },
};

const CommentSectionPlain = ({
    notes,
    newNoteValue,
    onEdit,
    handleAddNote,
    handleChange,
    onCancel,
    onNewNoteEditorBlur,
    classes,
}: Props) => {
    const CommentItem = ({ value, lastUpdated, lastUpdatedBy }) => (<div className={cx(classes.item)}>
        <div className={classes.avatar} /> {/* TODO: add avatar */}
        <div className={classes.rightColumn}>
            <div className={classes.header}>
                {lastUpdatedBy && <span className={cx(classes.headerText, classes.name)}>
                    {lastUpdatedBy.firstName} {' '} {lastUpdatedBy.surname}
                </span>}
                <span className={cx(classes.headerText, classes.lastUpdated)}>
                    {moment(lastUpdated).fromNow()}
                </span>
            </div>
            <div className={classes.body}>
                <Parser>{value}</Parser>
            </div>
        </div>
    </div>);


    return (
        <div className={classes.wrapper}>
            {notes.map(note => <CommentItem key={note.note} {...note} />)}
            <Editor onEdit={onEdit}>
                <FocusTextField
                    onBlur={onNewNoteEditorBlur}
                    onChange={handleChange}
                    value={newNoteValue}
                    data-test="comment-textfield"
                />
            </Editor>
            <div className={classes.newCommentButtonContainer} data-test="comment-buttons-container">
                <Button
                    onClick={() => handleAddNote(newNoteValue)}
                    className={classes.addCommentContainer}
                    primary
                >
                    {i18n.t('Add comment')}
                </Button>
                <Button
                    onClick={onCancel}
                >
                    {i18n.t('Cancel')}
                </Button>
            </div>
        </div>);
};

export const CommentSection: ComponentType<Props> = withStyles(styles)(CommentSectionPlain);
