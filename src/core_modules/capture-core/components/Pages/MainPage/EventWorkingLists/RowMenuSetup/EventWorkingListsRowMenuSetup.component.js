// @flow
import React, { useMemo, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import { WorkingListsInterfaceBuilder } from '../WorkingListsInterfaceBuilder';
import type { RowMenuContents } from '../../WorkingLists';
import type { Props } from './eventWorkingListsRowMenuSetup.types';

const getStyles = (theme: Theme) => ({
    deleteIcon: {
        fill: theme.palette.error.main,
    },
});

export const EventWorkingListsRowMenuSetupPlain = ({ onDeleteEvent, classes, ...passOnProps }: Props & CssClasses) => {
    const customRowMenuContents: RowMenuContents = useMemo(() => [{
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
        <WorkingListsInterfaceBuilder
            {...passOnProps}
            customRowMenuContents={customRowMenuContents}
        />
    );
};

export const EventWorkingListsRowMenuSetup: ComponentType<Props> =
    withStyles(getStyles)(EventWorkingListsRowMenuSetupPlain);
