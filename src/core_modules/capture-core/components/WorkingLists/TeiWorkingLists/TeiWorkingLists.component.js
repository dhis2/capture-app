// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import type { Props } from './teiWorkingLists.types';
import { TeiWorkingListsReduxProvider } from './ReduxProvider';

const getStyles = ({ typography }) => ({
    listContainer: {
        padding: typography.pxToRem(24),
    },
});

const TeiWorkingListsPlain = ({ classes: { listContainer }, ...passOnProps }: Props) => (
    <div data-test="tei-working-lists">
        <Paper className={listContainer}>
            <TeiWorkingListsReduxProvider
                storeId={'teiList'}
                {...passOnProps}
            />
        </Paper>
    </div>
);

export const TeiWorkingLists: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(TeiWorkingListsPlain);
