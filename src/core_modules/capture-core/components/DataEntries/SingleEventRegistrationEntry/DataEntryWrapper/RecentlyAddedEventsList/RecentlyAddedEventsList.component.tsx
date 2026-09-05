import i18n from '@dhis2/d2-i18n';
import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import { Card } from '@dhis2/ui';
import { OfflineEventsList } from '../../../../EventsList/OfflineEventsList/OfflineEventsList.component';
import { listId } from './RecentlyAddedEventsList.const';
import type { Props } from './RecentlyAddedEventsList.types';
import { useTermLabel } from '../../../../../metaData';

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
                {i18n.t('{{count}} {{eventLabel}} added', {
                    count: eventsAdded,
                    eventLabel,
                    eventsLabel,
                    defaultValue: '{{count}} {{eventLabel}} added',
                    defaultValue_plural: '{{count}} {{eventsLabel}} added',
                })}
            </div>
            <OfflineEventsList
                listId={listId}
                noItemsText={i18n.t('No {{eventsLabel}} added', { eventsLabel })}
                emptyListText={i18n.t('No {{eventsLabel}} added', { eventsLabel })}
                {...passOnProps}
            />
        </Card>
    );
};

export const NewEventsList = withStyles(styles)(NewEventsListPlain);
