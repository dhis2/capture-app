// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { LockedSelector } from '../../LockedSelector';
import { WorkingListsType } from './WorkingListsType';
import { WithoutOrgUnitSelectedMessage } from './WithoutOrgUnitSelectedMessage/WithoutOrgUnitSelectedMessage';
import type { Props } from './mainPage.types';
import { MainPageStatuses } from './MainPage.constants';

const getStyles = () => ({
    listContainer: {
        padding: 24,
    },
});

const MainPagePlain = ({ MainPageStatus, setShowAccessible, programId, classes, ...passOnProps }: Props) => (
    <>
        <LockedSelector />
        {
            MainPageStatus === MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED && (
                <WithoutOrgUnitSelectedMessage
                    programId={programId}
                    setShowAccessible={setShowAccessible}
                />
            )
        }
        {
            MainPageStatus === MainPageStatuses.SHOW_WORKING_LIST && (
                <div
                    className={classes.listContainer}
                    data-test={'main-page-working-list'}
                >
                    <WorkingListsType
                        programId={programId}
                        {...passOnProps}
                    />
                </div>
            )
        }
    </>
);

export const MainPageComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(MainPagePlain);
