import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconMessages24 } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { Theme } from '@material-ui/core/styles';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import { WidgetNote } from '../../../../WidgetNote';
import type { PlainProps } from './NotesSection.types';

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.grey[600],
        color: theme.palette.grey[50],
    },
});

type Props = PlainProps & WithStyles<typeof getStyles>;

const NotesSectionPlain = ({ classes, notes, onAddNote }: Props) => {
    const headerText = i18n.t('Notes');
    const count = notes ? notes.length : 0;

    const renderHeader = () => (
        <ViewEventSectionHeader
            icon={IconMessages24}
            text={headerText}
            badgeClass={classes.badge}
            badgeCount={count}
        />
    );

    return (
        <ViewEventSection
            collapsable
            header={renderHeader()}
        >
            <WidgetNote
                title={i18n.t('Notes about this event')}
                placeholder={i18n.t('Write a note about this event')}
                emptyNoteMessage={i18n.t('This event doesn\'t have any notes')}
                notes={notes || []}
                onAddNote={onAddNote}
            />
        </ViewEventSection>
    );
};

export const NotesSectionComponent = withStyles(getStyles)(NotesSectionPlain);
