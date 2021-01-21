// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { TeiWorkingListsReduxProvider } from './ReduxProvider';
import type { Props } from './teiWorkingLists.types';

const getStyles = ({ typography }) => ({
    listContainer: {
        padding: typography.pxToRem(24),
    },
});

const TeiWorkingListsPlain = ({ classes: { listContainer } }: Props) => (
    <div data-test="tei-working-lists">
        <Paper className={listContainer}>
            <TeiWorkingListsReduxProvider
                storeId={'teiList'}
            />
        </Paper>
    </div>
);

export const TeiWorkingLists: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(TeiWorkingListsPlain);
