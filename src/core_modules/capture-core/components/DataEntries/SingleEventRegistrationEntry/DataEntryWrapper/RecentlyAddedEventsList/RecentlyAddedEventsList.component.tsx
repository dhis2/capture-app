import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import { Card } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { OfflineEventsList } from '../../../../EventsList/OfflineEventsList/OfflineEventsList.component';
import { useStageLabel } from '../../../../../metaData';
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
    const eventSingular = useStageLabel('event') ?? i18n.t('event');
    const eventPlural = useStageLabel('event', { plural: true }) ?? i18n.t('events');
    const eventsAdded = props.events ? Object.keys(props.events).length : 0;
    const noEventsText = i18n.t('No {{eventLabel}} added', { eventLabel: eventPlural });
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
                    eventLabel: eventsAdded === 1 ? eventSingular : eventPlural,
                })}
            </div>
            <OfflineEventsList
                listId={listId}
                noItemsText={noEventsText}
                emptyListText={noEventsText}
                {...passOnProps}
            />
        </Card>
    );
};

export const NewEventsList = withStyles(styles)(NewEventsListPlain);
