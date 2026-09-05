import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconMessages24, colors, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

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
    emptyMessage: {
        fontSize: 14,
        color: colors.grey600,
        paddingBottom: spacersNum.dp8,
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
        const { classes, notes, fieldValue, onAddNote, ready, readOnly } = this.props;
        const isEmpty = ready && (!notes || notes.length === 0);
        return (
            <ViewEventSection
                collapsable
                header={this.renderHeader()}
            >
                {isEmpty && (
                    <div className={classes.emptyMessage} data-test="notes-empty-message">
                        {i18n.t("This event doesn't have any notes")}
                    </div>
                )}
                {React.createElement(LoadingNotes as any, {
                    ready,
                    notes,
                    readOnly,
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
