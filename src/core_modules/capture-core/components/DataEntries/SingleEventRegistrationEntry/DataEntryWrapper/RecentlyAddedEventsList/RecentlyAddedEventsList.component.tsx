import React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';

import { Card } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { OfflineEventsList } from '../../../../EventsList/OfflineEventsList/OfflineEventsList.component';
import { listId } from './RecentlyAddedEventsList.const';
import type { Props } from './RecentlyAddedEventsList.types';

const styles = (theme: any) => ({
    container: {
        padding: theme.typography.pxToRem(20),
    },
    header: {
        paddingBottom: theme.typography.pxToRem(10),
    },
});

const NewEventsListPlain = (props: Props & WithStyles<typeof styles>) => {
    const { classes, ...passOnProps } = props;
    const eventsAdded = props.events ? Object.keys(props.events).length : 0;
    if (eventsAdded === 0) {
        return null;
    }
    return (
        <Card className={classes.container}>
            <div
                className={classes.header}
            >
                {`${eventsAdded} ${i18n.t('events added')}`}
            </div>
            <OfflineEventsList
                listId={listId}
                noItemsText={i18n.t('No events added')}
                emptyListText={i18n.t('No events added')}
                {...passOnProps}
            />
        </Card>
    );
};

export const NewEventsList = withStyles(styles)(NewEventsListPlain);
