// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import getDataEntryKey from './common/getDataEntryKey';

import D2TextField from '../FormFields/Generic/D2TextField.component';
import Button from '../Buttons/Button.component';
import withDataEntryField from './dataEntryField/withDataEntryField';
import BorderBox from '../BorderBox/BorderBox.component';
import TextEditor from '../FormFields/TextEditor/TextEditor.component';
import textEditorCommandTypes from '../FormFields/TextEditor/textEditorCommandTypes';

type Props = {
    notes: Array<Object>,
    onAddNote: (value: string) => void,
    classes: {
        noteItem: string,
        inputContainer: string,
        borderBoxContent: string,
        newCommentButtonContainer: string,
        newNoteContainer: string,
        newNoteFormContainer: string,
        textEditorContainer: string,
        notesContainer: string,
    }
};

type State = {
    addIsOpen: boolean,
    value: ?string,
}

const styles = theme => ({
    noteItem: {
        background: theme.palette.grey[200],
        marginBottom: theme.typography.pxToRem(3),
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
        marginBottom: theme.typography.pxToRem(10),
    },
});

const getNotes = (InnerComponent: React.ComponentType<any>) =>
    class NotesBuilder extends React.Component<Props, State> {
        innerInstance: ?any;
        constructor(props) {
            super(props);
            this.state = {
                value: null,
                addIsOpen: false,
            };
        }

        toggleIsOpen = () => {
            this.setState(prevState => ({
                addIsOpen: !prevState.addIsOpen,
                value: null,
            }));
        }

        onNewNoteEditorBlur = (value: string) => {
            this.setState({ value });
        }

        renderInput = () => {
            const { classes, onAddNote } = this.props;
            return (
                <div className={classes.newNoteFormContainer}>
                    <TextEditor onBlur={this.onNewNoteEditorBlur} value={this.state.value} containerClassName={classes.textEditorContainer} />
                    <div className={classes.newCommentButtonContainer}>
                        <Button onClick={onAddNote} color="primary">
                            {i18n.t('Save comment')}
                        </Button>
                        <Button onClick={this.toggleIsOpen}>
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

        getNotes = () => {
            const { notes, classes } = this.props;
            return (
                <div className={classes.notesContainer}>
                    <div>Comments</div>
                    <List dense>
                        {notes.map(n => (
                            <ListItem className={classes.noteItem}>
                                <ListItemText primary={n.value} secondary={`${i18n.t('by')} ${n.storedBy} ${i18n.t('at')} ${n.storedDate}`} />
                            </ListItem>
                        ))}
                    </List>
                    <div className={classes.newNoteContainer}>
                        { this.state.addIsOpen ? this.renderInput() : this.renderButton() }
                    </div>

                </div>
            );
        }

        render = () => {
            const { notes, ...passOnProps } = this.props;
            return (
                <div>
                    <InnerComponent
                        ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                        notes={this.getNotes()}
                        {...passOnProps}
                    />
                </div>
            );
        }
    };

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        notes: state.dataEntriesNotes[key] || [],
    };
};

export default settingsFn =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(styles)(connect(
            mapStateToProps, null, null, { withRef: true })(getNotes(InnerComponent)));
