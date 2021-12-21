// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { WorkingListsType } from './WorkingListsType';
import { LockedSelector } from '../../LockedSelector';
import type { Props } from './mainPage.types';
import { MainPageStatuses } from './MainPage.constants';
import { WithoutOrgUnitSelectedMessage } from './WithoutOrgUnitSelectedMessage/WithoutOrgUnitSelectedMessage';
import { WithoutCategorySelectedMessage } from './WithoutCategorySelectedMessage/WithoutCategorySelectedMessage';

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
            MainPageStatus === MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED && (
                <WithoutCategorySelectedMessage
                    programId={programId}
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
