import { colors, spacers } from '@dhis2/ui';
import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { TrackerWorkingListsReduxProvider } from './ReduxProvider';
import type { Props } from './trackerWorkingLists.types';
import { TRACKER_WORKING_LISTS_STORE_ID } from './constants';

const styles = {
    listContainer: {
        width: '100%',
        height: 'fit-content',
        padding: spacers.dp16,
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
    },
};

type OwnProps = Omit<Props, keyof WithStyles<typeof styles>>;

const TrackerWorkingListsPlain = ({ classes: { listContainer }, ...passOnProps }: Props) => (
    <div className={listContainer} data-test="tracker-working-lists">
        <TrackerWorkingListsReduxProvider
            storeId={TRACKER_WORKING_LISTS_STORE_ID}
            {...passOnProps}
        />
    </div>
);

export const TrackerWorkingLists = withStyles(styles)(TrackerWorkingListsPlain) as ComponentType<OwnProps>;
