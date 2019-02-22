// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Chat as ChatIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core';
import ViewEventSection from '../../Section/ViewEventSection.component';
import ViewEventSectionHeader from '../../Section/ViewEventSectionHeader.component';
import Notes from '../../../../Notes/Notes.component';


type Props = {
    classes: Object,
    notes: ?Array<any>,
    onAddNote: () => void,
    onUpdateNoteField: (value: string) => void,
    fieldValue: ?string,
}

const headerText = i18n.t('Comments');

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.grey.light,
    },
    note: {
        marginTop: theme.typography.pxToRem(5),
        marginBottom: theme.typography.pxToRem(5),
        padding: theme.typography.pxToRem(10),
        borderRadius: theme.typography.pxToRem(4),
        backgroundColor: theme.palette.grey.lighter,
    },
});

class NotesSection extends React.Component<Props> {
    renderHeader = () => {
        const { classes, notes } = this.props;
        const count = notes ? notes.length : 0;
        return (
            <ViewEventSectionHeader
                icon={ChatIcon}
                text={headerText}
                badgeClass={classes.badge}
                badgeCount={count}
            />
        );
    }

    render() {
        const { notes, fieldValue, onAddNote } = this.props;
        return (
            <ViewEventSection
                collapsable
                header={this.renderHeader()}
            >
                <Notes
                    notes={notes}
                    onAddNote={onAddNote}
                    onBlur={this.props.onUpdateNoteField}
                    value={fieldValue}
                />
            </ViewEventSection>
        );
    }
}

export default withStyles(getStyles)(NotesSection);
