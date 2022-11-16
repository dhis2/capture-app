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
    commentsWrapper: {
        maxHeight: 400,
        overflowY: 'auto',
    },
    editor: {
        paddingTop: spacersNum.dp16,
    },
    emptyComments: {
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
    newCommentButtonContainer: {
        paddingTop: spacersNum.dp4,
        display: 'flex',
        gap: '4px',
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

    const CommentItem = ({ value, storedAt, createdBy }) => (
        <div data-test="comment-item" className={cx(classes.item)}>
            {/* TODO: add avatar */}
            <div className={classes.rightColumn}>
                <div className={classes.header}>
                    {createdBy && <span className={cx(classes.headerText, classes.name)}>
                        {createdBy.firstName} {' '} {createdBy.surname}
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
