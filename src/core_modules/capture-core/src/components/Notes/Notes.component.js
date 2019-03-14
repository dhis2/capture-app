// @flow

import * as React from 'react';
import { Editor, Parser } from '@dhis2/d2-ui-rich-text';
import i18n from '@dhis2/d2-i18n';
import List from '@material-ui/core/List';
import { withFocusSaver } from 'capture-ui';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import Button from '../Buttons/Button.component';
import { TextField } from '../FormFields/New';
import type { Note } from './notes.types';


const FocusTextField = withFocusSaver()(TextField);

type Props = {
    notes: Array<Note>,
    onAddNote: (value: string) => void,
    onBlur: (value: ?string, options: any) => void,
    value: ?string,
    readonly?: ?boolean,
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
    }
};

type State = {
    addIsOpen: boolean,
    value: ?string,
}

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
});

class Notes extends React.Component<Props, State> {
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
                    />
                </Editor>
                <div className={classes.newCommentButtonContainer}>
                    <Button onClick={this.handleAddNote} color="primary">
                        {i18n.t('Add comment')}
                    </Button>
                    <Button onClick={this.onCancel}>
                        {i18n.t('Cancel')}
                    </Button>
                </div>

            </div>
        );
    }

    renderButton = () => (
        <Button onClick={this.toggleIsOpen}>
            {i18n.t('Write comment')}
        </Button>
    )

    render = () => {
        const { notes, classes, readonly } = this.props;
        return (
            <div className={classes.notesContainer}>
                <List dense className={classes.notesList}>
                    {notes.map(n => (
                        <ListItem className={classes.noteItem} key={n.clientId}>
                            <div className={classes.noteItemHeader}>
                                <div className={classes.noteItemUser}>
                                    {n.storedBy}
                                </div>
                                <div className={classes.noteItemDate}>
                                    {n.storedDate}
                                </div>
                            </div>
                            <div>
                                <Parser>{n.value}</Parser>
                            </div>
                        </ListItem>
                    ))}
                </List>
                {
                    !readonly &&
                    <div className={classes.newNoteContainer}>
                        { this.state.addIsOpen ? this.renderInput() : this.renderButton() }
                    </div>
                }

            </div>
        );
    }
}

export default withStyles(styles)(Notes);
