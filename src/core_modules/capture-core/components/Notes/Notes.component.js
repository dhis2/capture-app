// @flow

import * as React from 'react';
import { Editor, Parser } from '@dhis2/d2-ui-rich-text';
import { withStyles } from '@material-ui/core';
import { colors, spacersNum, Menu, MenuItem, Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withFocusSaver } from 'capture-ui';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { TextField } from '../FormFields/New';
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
    newCommentButtonContainer: {
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
    newNoteButtonContainer: {
        display: 'inline-block',
    },
    addCommentContainer: {
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
        newCommentButtonContainer: string,
        newNoteContainer: string,
        newNoteFormContainer: string,
        textEditorContainer: string,
        notesContainer: string,
        noteItemHeader: string,
        noteItemUser: string,
        noteItemDate: string,
        notesList: string,
        addCommentContainer: string,
        newNoteButtonContainer: string,
    },
};

type State = {
    addIsOpen: boolean,
    value: ?string,
}

class NotesPlain extends React.Component<Props, State> {
    static defaultProps = {
        entityAccess: { read: true, write: true },
    }
    constructor(props: Props) {
        super(props);
        this.state = {
            addIsOpen: !!this.props.value,
            value: this.props.value || null,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        if (nextProps.value !== this.props.value
            || this.props.value !== this.state.value) {
            this.setState({
                value: nextProps.value,
            });
        }
    }

    toggleIsOpen = () => {
        this.setState(prevState => ({
            addIsOpen: !prevState.addIsOpen,
        }));
    }

    onCancel = () => {
        this.props.onBlur(null, { touched: false });
        this.toggleIsOpen();
    }

    onNewNoteEditorBlur = (value: string) => {
        this.props.onBlur(value, { touched: false });
    }

    handleAddNote = () => {
        if (this.props.value) {
            this.props.onAddNote(this.props.value);
        }
        this.toggleIsOpen();
        this.props.onBlur(null, { touched: false });
    }

    handleChange = (value: ?string) => {
        this.setState({ value });
    }

    renderInput = () => {
        const { classes } = this.props;
        return (
            <div className={classes.newNoteFormContainer}>

                <Editor onEdit={this.handleChange}>
                    <FocusTextField
                        onBlur={this.onNewNoteEditorBlur}
                        onChange={this.handleChange}
                        value={this.state.value}
                        multiLine
                        data-test="comment-textfield"
                    />
                </Editor>
                <div className={classes.newCommentButtonContainer} data-test="comment-buttons-container">
                    <Button
                        onClick={this.handleAddNote}
                        className={classes.addCommentContainer}
                        primary
                        small
                    >
                        {i18n.t('Add comment')}
                    </Button>
                    <Button
                        onClick={this.onCancel}
                        secondary
                        small
                    >
                        {i18n.t('Cancel')}
                    </Button>
                </div>

            </div>
        );
    }

    renderButton = (canAddComment: boolean) => {
        const { smallMainButton, classes } = this.props;
        return (
            <div
                className={classes.newNoteButtonContainer}
                data-test="new-comment-button"
            >
                <ConditionalTooltip
                    content={i18n.t('You don\'t have access to write comments')}
                    enabled={!canAddComment}
                >
                    <Button
                        onClick={this.toggleIsOpen}
                        disabled={!canAddComment}
                        small={smallMainButton}
                    >
                        {i18n.t('Write comment')}
                    </Button>
                </ConditionalTooltip>
            </div>
        );
    }

    render = () => {
        const { notes, classes, entityAccess } = this.props;
        return (
            <div className={classes.notesContainer}>
                <Menu dense className={classes.notesList} data-test="comments-list">
                    {notes.map(n => (
                        <MenuItem
                            className={classes.noteItem}
                            key={n.clientId}
                            data-test="comment"
                            label={<>
                                <div className={classes.noteItemHeader}>
                                    <div className={classes.noteItemUser} data-test="comment-user">
                                        {n.createdBy ? `${n.createdBy.firstName} ${n.createdBy.surname}` : `${n.storedBy}` }
                                    </div>
                                    <div className={classes.noteItemDate} data-test="comment-date">
                                        {n.storedDate}
                                    </div>
                                </div>
                                <div data-test="comment-text">
                                    <Parser>{n.value}</Parser>
                                </div>
                            </>}
                        />
                    ))}
                </Menu>
                {
                    <div className={classes.newNoteContainer} data-test="new-comment-container">
                        { this.state.addIsOpen ? this.renderInput() : this.renderButton(entityAccess.write) }
                    </div>
                }

            </div>
        );
    }
}

export const Notes = withStyles(styles)(NotesPlain);
