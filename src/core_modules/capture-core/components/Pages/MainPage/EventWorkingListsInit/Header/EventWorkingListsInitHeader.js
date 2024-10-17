// @flow
import { colors, spacers } from '@dhis2/ui';
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import type { Props } from './eventWorkingListsInitHeader.types';

const getStyles = () => ({
    container: {
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
        padding: spacers.dp16,
    },
});

const EventWorkingListsInitHeaderPlain =
    ({ children, classes: { container, listContainer } }: Props) => (
        <div className={container}>
            <div
                className={listContainer}
            >
                {children}
            </div>
        </div>
    );

export const EventWorkingListsInitHeader: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(getStyles)(EventWorkingListsInitHeaderPlain);
