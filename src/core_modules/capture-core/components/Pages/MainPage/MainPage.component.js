// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { WorkingListsType } from './WorkingListsType';
import { LockedSelector } from '../../LockedSelector/LockedSelector.container';
import type { Props } from './mainPage.types';

const getStyles = () => ({
    listContainer: {
        padding: 24,
    },
});

const MainPagePlain = ({ currentSelectionsComplete, classes, ...passOnProps }: Props) => (
    <>
        <LockedSelector />
        {
            !currentSelectionsComplete ? null : (
                <div
                    className={classes.listContainer}
                >
                    <WorkingListsType
                        {...passOnProps}
                    />
                </div>
            )
        }
    </>
);

export const MainPageComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(MainPagePlain);
