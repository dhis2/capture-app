import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconMessages24 } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';

import type { ComponentType } from 'react';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import { Notes } from '../../../../Notes/Notes.component';
import { withLoadingIndicator } from '../../../../../HOC/withLoadingIndicator';
import type { PlainProps } from './NotesSection.types';

const LoadingNotes = withLoadingIndicator(null, props => ({ style: props.loadingIndicatorStyle }))(Notes);

const headerText = i18n.t('Notes');

const getStyles = (theme: any) => ({
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

type Props = PlainProps & WithStyles<typeof getStyles>;

class NotesSectionPlain extends React.Component<Props> {
    renderHeader = () => {
        const { classes, notes, ready } = this.props;
        const count = notes ? notes.length : 0;
        const badgeCount = ready ? count : undefined;
        return (
            <ViewEventSectionHeader
                icon={IconMessages24}
                text={headerText}
                badgeClass={classes.badge}
                badgeCount={badgeCount}
            />
        );
    }

    render() {
        const { notes, fieldValue, onAddNote, ready, programStage, eventAccess } = this.props;
        return (
            <ViewEventSection
                collapsable
                header={this.renderHeader()}
            >
                {React.createElement(LoadingNotes as any, {
                    ready,
                    notes,
                    entityAccess: eventAccess,
                    addNotAllowed: !programStage.stageForm.access.data.write,
                    onAddNote,
                    onBlur: this.props.onUpdateNoteField,
                    value: fieldValue,
                    smallMainButton: true,
                })}
            </ViewEventSection>
        );
    }
}

export const NotesSectionComponent = withStyles(getStyles)(NotesSectionPlain) as ComponentType<PlainProps>;
