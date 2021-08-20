// @flow
import React, { useMemo, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { IconDelete24, colors } from '@dhis2/ui';
import { EventWorkingListsUpdateTrigger } from '../UpdateTrigger';
import type { CustomRowMenuContents } from '../../WorkingListsBase';
import type { Props } from './eventWorkingListsRowMenuSetup.types';

const getStyles = () => ({
    deleteContainer: {
        display: 'flex',
    },
});

export const EventWorkingListsRowMenuSetupPlain = ({ onDeleteEvent, classes, ...passOnProps }: Props) => {
    const customRowMenuContents: CustomRowMenuContents = useMemo(() => [{
        key: 'deleteEventItem',
        clickHandler: ({ id }) => onDeleteEvent(id),
        element: (
            <span
                data-test="delete-event-button"
                className={classes.deleteContainer}
            >
                <IconDelete24 color={colors.red400} />
                {i18n.t('Delete event')}
            </span>
        ),
    }], [onDeleteEvent, classes.deleteContainer]);

    return (
        <EventWorkingListsUpdateTrigger
            {...passOnProps}
            customRowMenuContents={customRowMenuContents}
        />
    );
};

export const EventWorkingListsRowMenuSetup: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(getStyles)(EventWorkingListsRowMenuSetupPlain);
