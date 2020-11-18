// @flow
import React, { useMemo, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import { EventWorkingListsUpdateTrigger } from '../UpdateTrigger';
import type { CustomRowMenuContents } from '../../WorkingLists';
import type { Props } from './eventWorkingListsRowMenuSetup.types';

const getStyles = (theme: Theme) => ({
    deleteIcon: {
        fill: theme.palette.error.main,
    },
});

export const EventWorkingListsRowMenuSetupPlain = ({ onDeleteEvent, classes, ...passOnProps }: Props) => {
    const customRowMenuContents: CustomRowMenuContents = useMemo(() => [{
        key: 'deleteEventItem',
        clickHandler: ({ eventId }) => onDeleteEvent(eventId),
        element: (
            <React.Fragment>
                <Delete className={classes.deleteIcon} />
                {i18n.t('Delete event')}
            </React.Fragment>
        ),
    }], [onDeleteEvent, classes.deleteIcon]);

    return (
        <EventWorkingListsUpdateTrigger
            {...passOnProps}
            customRowMenuContents={customRowMenuContents}
        />
    );
};

export const EventWorkingListsRowMenuSetup: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(getStyles)(EventWorkingListsRowMenuSetupPlain);
