// @flow

import * as React from 'react';
import { Editor, Parser } from '@dhis2/d2-ui-rich-text';
import {
    List,
    ListItem,
    Tooltip,
    withStyles,
} from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { withFocusSaver } from 'capture-ui';
import { Button } from '../Buttons';
import { TextField } from '../FormFields/New';
import type { Note } from './notes.types';


const FocusTextField = withFocusSaver()(TextField);

const styles = theme => ({
    noteItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'normal',
        background: theme.palette.grey.lighter,
        marginBottom: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(14),
    },
    commandButton: {
        width: theme.typography.pxToRem(30),
        height: theme.typography.pxToRem(30),
    },
    borderBoxContent: {
        margin: theme.typography.pxToRem(10),
    },
    newCommentButtonContainer: {
        marginTop: theme.typography.pxToRem(10),
    },
    newNoteContainer: {
    },
    newNoteFormContainer: {
        background: theme.palette.grey.lighter,
        padding: theme.typography.pxToRem(10),
    },
    notesContainer: {
    },
    noteItemHeader: {
        display: 'flex',
    },
    noteItemUser: {
        flexGrow: 1,
        fontWeight: 'bold',
    },
    noteItemDate: {
        color: theme.palette.grey[600],
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

class Notes extends React.Component<Props, State> {
    static defaultProps = {
        entityAccess: { read: true, write: true },
    }
    innerInstance: ?any;
    constructor(props: Props) {
        super(props);
        this.state = {
            addIsOpen: !!this.props.value,
            value: this.props.value || null,
        };
    }

    componentWillReceiveProps(nextProps: Props) {
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
                        data-test="dhis2-capture-comment-textfield"
                    />
                </Editor>
                <div className={classes.newCommentButtonContainer} data-test="dhis2-capture-comment-buttons-container">
                    <Button
                        onClick={this.handleAddNote}
                        className={classes.addCommentContainer}
                        primary
                    >
                        {i18n.t('Add comment')}
                    </Button>
                    <Button
                        onClick={this.onCancel}
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
            <Tooltip title={canAddComment ? '' : i18n.t('You dont have access to write comments')}>
                <div className={classes.newNoteButtonContainer} data-test="dhis2-capture-new-comment-button">
                    <Button
                        onClick={this.toggleIsOpen}
                        disabled={!canAddComment}
                        small={smallMainButton}
                    >
                        {i18n.t('Write comment')}
                    </Button>
                </div>
            </Tooltip>
        );
    }

    render = () => {
        const { notes, classes, entityAccess } = this.props;
        return (
            <div className={classes.notesContainer}>
                <List dense className={classes.notesList} data-test="dhis2-capture-comments-list">
                    {notes.map(n => (
                        <ListItem className={classes.noteItem} key={n.clientId} data-test="dhis2-capture-comment">
                            <div className={classes.noteItemHeader}>
                                <div className={classes.noteItemUser} data-test="dhis2-capture-comment-user">
                                    {n.storedBy}
                                </div>
                                <div className={classes.noteItemDate} data-test="dhis2-capture-comment-date">
                                    {n.storedDate}
                                </div>
                            </div>
                            <div data-test="dhis2-capture-comment-text">
                                <Parser>{n.value}</Parser>
                            </div>
                        </ListItem>
                    ))}
                </List>
                {
                    <div className={classes.newNoteContainer} data-test="dhis2-capture-new-comment-container">
                        { this.state.addIsOpen ? this.renderInput() : this.renderButton(entityAccess.write) }
                    </div>
                }

            </div>
        );
    }
}

export default withStyles(styles)(Notes);
