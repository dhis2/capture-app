// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import i18n from '@dhis2/d2-i18n';
import OfflineEventsList from '../../../../EventsList/OfflineEventsList/OfflineEventsList.component';
import { listId } from './RecentlyAddedEventsList.const';

type Props = {
    classes: {
        container: string,
        header: string,
    },
    events?: ?any,
};

const styles = (theme: Theme) => ({
    container: {
        padding: theme.typography.pxToRem(20),
    },
    header: {
        paddingBottom: theme.typography.pxToRem(10),
    },
});

const NewEventsList = (props: Props) => {
    const { classes, ...passOnProps } = props;
    const eventsAdded = props.events ? Object.keys(props.events).length : 0;
    if (eventsAdded === 0) {
        return null;
    }
    return (
        <Paper className={classes.container}>
            <div
                className={classes.header}
            >
                {`${eventsAdded} ${i18n.t('events added')}`}
            </div>
            {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
            <OfflineEventsList
                listId={listId}
                noItemsText={i18n.t('No events added')}
                emptyListText={i18n.t('No events added')}
                {...passOnProps}
            />
        </Paper>
    );
};

export default withStyles(styles)(NewEventsList);
