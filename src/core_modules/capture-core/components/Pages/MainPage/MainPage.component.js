// @flow
import React, { useMemo } from 'react';
import { compose } from 'redux';
import { colors, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import type { ComponentType } from 'react';
import type { Props, ContainerProps } from './mainPage.types';
import { WorkingListsType } from './WorkingListsType';
import { MainPageStatuses } from './MainPage.constants';
import { WithoutOrgUnitSelectedMessage } from './WithoutOrgUnitSelectedMessage/WithoutOrgUnitSelectedMessage';
import { WithoutCategorySelectedMessage } from './WithoutCategorySelectedMessage/WithoutCategorySelectedMessage';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { SearchBox } from '../../SearchBox';
import { TemplateSelector } from '../../TemplateSelector';
import {
    InvalidCategoryCombinationForOrgUnitMessage,
} from './InvalidCategoryCombinationForOrgUnitMessage/InvalidCategoryCombinationForOrgUnitMessage';
import { NoSelectionsInfoBox } from './NoSelectionsInfoBox';

const getStyles = () => ({
    listContainer: {
        padding: 24,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacers.dp16,
        padding: spacers.dp16,
    },
    half: {
        flex: 1,
    },
    quarter: {
        flex: 0.4,
    },
    searchBoxWrapper: {
        padding: spacers.dp16,
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
    },
});

const MainPagePlain = ({
    programId,
    orgUnitId,
    trackedEntityTypeId,
    displayFrontPageList,
    selectedTemplateId,
    MainPageStatus,
    setShowAccessible,
    classes,
    onChangeTemplate,
}: Props) => {
    const showMainPage = useMemo(() => {
        const noProgramSelected = !programId;
        const noOrgUnitSelected = !orgUnitId;
        const isEventProgram = !trackedEntityTypeId;
        return noProgramSelected || noOrgUnitSelected || isEventProgram || displayFrontPageList || selectedTemplateId;
    }, [programId, orgUnitId, trackedEntityTypeId, displayFrontPageList, selectedTemplateId]);

    return (
        <>
            {showMainPage ? (
                <>
                    {MainPageStatus === MainPageStatuses.DEFAULT && (
                        <NoSelectionsInfoBox />
                    )}
                    {MainPageStatus === MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED && (
                        <WithoutOrgUnitSelectedMessage programId={programId} setShowAccessible={setShowAccessible} />
                    )}
                    {MainPageStatus === MainPageStatuses.CATEGORY_OPTION_INVALID_FOR_ORG_UNIT && (
                        <InvalidCategoryCombinationForOrgUnitMessage />
                    )}
                    {MainPageStatus === MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED && (
                        <WithoutCategorySelectedMessage programId={programId} />
                    )}
                    {MainPageStatus === MainPageStatuses.SHOW_WORKING_LIST && (
                        <div className={classes.listContainer} data-test={'main-page-working-list'}>
                            <WorkingListsType
                                programId={programId}
                                orgUnitId={orgUnitId}
                                selectedTemplateId={selectedTemplateId}
                                onChangeTemplate={onChangeTemplate}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className={classes.container}>
                    <div className={`${classes.half} ${classes.searchBoxWrapper}`}>
                        <SearchBox programId={programId} />
                    </div>
                    <div className={classes.quarter}>
                        <TemplateSelector />
                    </div>
                </div>
            )}
        </>
    );
};


export const MainPageComponent: ComponentType<ContainerProps> =
    compose(
        withLoadingIndicator(),
        withErrorMessageHandler(),
        withStyles(getStyles),
    )(MainPagePlain);
