// @flow
import React, { type ComponentType, useState, useCallback } from 'react';
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
    comments: Array<Object>,
    handleAddComment: (text: string) => void,
    placeholder: string,
    emptyCommentMessage: string,
    ...CssClasses
}

const styles = {
    item: {
        '&:not(:last-child)': {
            marginBottom: spacersNum.dp16,
        },
        marginTop: spacersNum.dp16,
        padding: '12px',
        background: '#F3F5F7',
        display: 'flex',
        flexDirection: 'column',
    },
    wrapper: {
        marginLeft: spacersNum.dp16,
        marginRight: spacersNum.dp16,
        paddingBottom: spacersNum.dp24,
    },
    commentsWrapper: {
        maxHeight: 500,
        overflowY: 'scroll',
    },
    editor: {
        paddingTop: spacersNum.dp16,
    },
    emptyComments: {
        fontSize: 14,
        color: colors.grey600,
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
    newCommentButtonContainer: {
        paddingTop: spacersNum.dp8,
    },
    addCommentContainer: {
        marginRight: spacersNum.dp8,
    },
};

const CommentSectionPlain = ({
    placeholder,
    emptyCommentMessage,
    comments,
    handleAddComment,
    classes,
}: Props) => {
    const [isEditing, setEditing] = useState(false);
    const [newCommentValue, setNewCommentValue] = useState('');

    const handleChange = useCallback((value) => {
        setEditing(true);
        setNewCommentValue(value);
    }, []);

    const onCancel = useCallback(() => {
        setNewCommentValue('');
        setEditing(false);
    }, []);

    const onAddComment = useCallback(() => {
        handleAddComment(newCommentValue);
        setNewCommentValue('');
        setEditing(false);
    }, [handleAddComment, newCommentValue]);

    const CommentItem = ({ value, storedAt, lastUpdatedBy }) => (
        <div data-test="comment-item" className={cx(classes.item)}>
            <div className={classes.avatar} /> {/* TODO: add avatar */}
            <div className={classes.rightColumn}>
                <div className={classes.header}>
                    {lastUpdatedBy && <span className={cx(classes.headerText, classes.name)}>
                        {lastUpdatedBy.firstName} {' '} {lastUpdatedBy.surname}
                    </span>}
                    <span className={cx(classes.headerText, classes.lastUpdated)}>
                        {moment(storedAt).fromNow()}
                    </span>
                </div>
                <div className={classes.body}>
                    <Parser>{value}</Parser>
                </div>
            </div>
        </div>
    );


    return (
        <div className={classes.wrapper}>
            <div className={classes.commentsWrapper}>
                {comments
                    .sort((a, b) => moment(a.storedAt).valueOf() - moment(b.storedAt).valueOf())
                    .map(comment => <CommentItem key={`comment-item-${comment.note}-`} {...comment} />)
                }
                {comments.length === 0 &&
                <div className={classes.emptyComments}>
                    {emptyCommentMessage}
                </div>}
            </div>

            <div className={classes.editor}>
                <Editor>
                    <FocusTextField
                        placeholder={placeholder}
                        onChange={handleChange}
                        value={newCommentValue}
                        data-test="comment-textfield"
                    />
                </Editor>
            </div>

            {isEditing && <div className={classes.newCommentButtonContainer} data-test="comment-buttons-container">
                <Button
                    dataTest="add-comment-btn"
                    onClick={onAddComment}
                    className={classes.addCommentContainer}
                    primary
                >
                    {i18n.t('Save comment')}
                </Button>
                <Button
                    dataTest="cancel-comment-btn"
                    onClick={onCancel}
                >
                    {i18n.t('Cancel')}
                </Button>
            </div>}
        </div>);
};

export const CommentSection: ComponentType<Props> = withStyles(styles)(CommentSectionPlain);
