// @flow
import { colors, spacers } from '@dhis2/ui';
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TeiWorkingListsReduxProvider } from './ReduxProvider';
import type { Props } from './teiWorkingLists.types';
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

const TeiWorkingListsPlain = ({ classes: { listContainer }, ...passOnProps }: Props) => (
    <div className={listContainer} data-test="tei-working-lists">
        <TeiWorkingListsReduxProvider
            storeId={TEI_WORKING_LISTS_STORE_ID}
            {...passOnProps}
        />
    </div>
);

export const TeiWorkingLists: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(TeiWorkingListsPlain);
