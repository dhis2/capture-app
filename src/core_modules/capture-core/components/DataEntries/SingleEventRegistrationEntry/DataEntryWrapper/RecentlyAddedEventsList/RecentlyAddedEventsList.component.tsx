import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import { Card } from '@dhis2/ui';
import { OfflineEventsList } from '../../../../EventsList/OfflineEventsList/OfflineEventsList.component';
import { listId } from './RecentlyAddedEventsList.const';
import type { Props } from './RecentlyAddedEventsList.types';
import { useTermLabel } from '../../../../../metaData';
import { tCustomTerm } from '../../../../../utils/tCustomTerm';

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
    const eventLabel = useTermLabel('event');
    const eventsLabel = useTermLabel('event', { plural: true });
    const eventsAdded = props.events ? Object.keys(props.events).length : 0;
    if (eventsAdded === 0) {
        return null;
    }
    return (
        <Card className={classes.container}>
            <div
                className={classes.header}
            >
                {tCustomTerm('{{count}} {{eventLabel}} added', {
                    count: eventsAdded,
                    eventLabel,
                    eventsLabel,
                    defaultValue: '{{count}} {{eventLabel}} added',
                    defaultValue_plural: '{{count}} {{eventsLabel}} added',
                })}
            </div>
            <OfflineEventsList
                listId={listId}
                noItemsText={tCustomTerm('No {{eventsLabel}} added', { eventsLabel })}
                emptyListText={tCustomTerm('No {{eventsLabel}} added', { eventsLabel })}
                {...passOnProps}
            />
        </Card>
    );
};

export const NewEventsList = withStyles(styles)(NewEventsListPlain);
