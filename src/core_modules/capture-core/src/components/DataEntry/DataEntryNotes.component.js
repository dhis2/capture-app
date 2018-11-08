// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import Button from '../Buttons/Button.component';
import TextEditor from '../FormFields/TextEditor/TextEditor.component';

type Props = {
    notes: Array<Object>,
    onAddNote: (itemId: string, dataEntryId: string, value: string) => void,
    onBlur: (value: ?string, options: any) => void,
    value: ?string,
    id: string,
    itemId: string,
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
}

const styles = theme => ({
    noteItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'normal',
        background: theme.palette.grey[200],
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
        marginTop: theme.typography.pxToRem(5),
        marginBottom: theme.typography.pxToRem(5),
    },
    newNoteFormContainer: {
        background: theme.palette.grey[200],
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

class DataEntryNotes extends React.Component<Props, State> {
    innerInstance: ?any;
    constructor(props: Props) {
        super(props);
        this.state = {
            addIsOpen: !!this.props.value,
        };
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
            this.props.onAddNote(this.props.itemId, this.props.id, this.props.value);
        }
        this.props.onBlur(null, { touched: false });
    }

    renderInput = () => {
        const { classes } = this.props;
        return (
            <div className={classes.newNoteFormContainer}>
                <TextEditor onBlur={this.onNewNoteEditorBlur} value={this.props.value} containerClassName={classes.textEditorContainer} />
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
        const { notes, classes } = this.props;
        return (
            <div className={classes.notesContainer}>
                <List dense className={classes.notesList}>
                    {notes.map(n => (
                        <ListItem className={classes.noteItem} key={n.key}>
                            <div className={classes.noteItemHeader}>
                                <div className={classes.noteItemUser}>
                                    {n.storedBy}
                                </div>
                                <div className={classes.noteItemDate}>
                                    {n.storedDate}
                                </div>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: n.value }} />
                        </ListItem>
                    ))}
                </List>
                <div className={classes.newNoteContainer}>
                    { this.state.addIsOpen ? this.renderInput() : this.renderButton() }
                </div>

            </div>
        );
    }
}

export default withStyles(styles)(DataEntryNotes);
