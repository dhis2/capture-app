// @flow
import { colors, spacers } from '@dhis2/ui';
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TrackerWorkingListsReduxProvider } from './ReduxProvider';
import type { Props } from './TrackerWorkingLists.types';
import { TEI_WORKING_LISTS_STORE_ID } from './constants';

const getStyles = () => ({
    listContainer: {
        width: '100%',
        height: 'fit-content',
        padding: spacers.dp16,
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
    },
});

const TrackerWorkingListsPlain = ({ classes: { listContainer }, ...passOnProps }: Props) => (
    <div className={listContainer} data-test="tei-working-lists">
        <TrackerWorkingListsReduxProvider
            storeId={TEI_WORKING_LISTS_STORE_ID}
            {...passOnProps}
        />
    </div>
);

export const TrackerWorkingLists: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(TrackerWorkingListsPlain);
