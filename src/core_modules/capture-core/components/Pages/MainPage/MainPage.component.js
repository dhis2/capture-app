// @flow
import React, { useMemo } from 'react';
import { compose } from 'redux';
import { colors, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { WorkingListsType } from './WorkingListsType';
import type { Props, PlainProps } from './mainPage.types';
import { MainPageStatuses } from './MainPage.constants';
import { WithoutOrgUnitSelectedMessage } from './WithoutOrgUnitSelectedMessage/WithoutOrgUnitSelectedMessage';
import { WithoutCategorySelectedMessage } from './WithoutCategorySelectedMessage/WithoutCategorySelectedMessage';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { TopBar } from './TopBar.container';
import { SearchBox } from '../../SearchBox';
import { TemplateSelector } from '../../TemplateSelector';

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

const useShowMainPage = ({ programId, orgUnitId, trackedEntityTypeId, displayFrontPageList, selectedTemplateId }) =>
    useMemo(() => {
        const noProgramSelected = !programId;
        const noOrgUnitSelected = !orgUnitId;
        const isEventProgram = !trackedEntityTypeId;

        return noProgramSelected || noOrgUnitSelected || isEventProgram || displayFrontPageList || selectedTemplateId;
    }, [programId, orgUnitId, trackedEntityTypeId, displayFrontPageList, selectedTemplateId]);

const MainPageBody = compose(
    withErrorMessageHandler(),
    withStyles(getStyles),
)(({ MainPageStatus, setShowAccessible, programId, showMainPage, classes, ...passOnProps }: PlainProps) => (
    <>
        {showMainPage ? (
            <>
                {MainPageStatus === MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED && (
                    <WithoutOrgUnitSelectedMessage programId={programId} setShowAccessible={setShowAccessible} />
                )}
                {MainPageStatus === MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED && (
                    <WithoutCategorySelectedMessage programId={programId} />
                )}
                {MainPageStatus === MainPageStatuses.SHOW_WORKING_LIST && (
                    <div className={classes.listContainer} data-test={'main-page-working-list'}>
                        <WorkingListsType programId={programId} {...passOnProps} />
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
));

const MainPage = ({
    programId,
    orgUnitId,
    trackedEntityTypeId,
    displayFrontPageList,
    selectedTemplateId,
    selectedCategories,
    ...passOnProps
}: Props) => {
    const showMainPage = useShowMainPage({
        programId,
        orgUnitId,
        trackedEntityTypeId,
        displayFrontPageList,
        selectedTemplateId,
    });

    return (
        <>
            <TopBar programId={programId} orgUnitId={orgUnitId} selectedCategories={selectedCategories} />
            <MainPageBody
                programId={programId}
                orgUnitId={orgUnitId}
                selectedTemplateId={selectedTemplateId}
                showMainPage={showMainPage}
                {...passOnProps}
            />
        </>
    );
};

export const MainPageComponent = withLoadingIndicator()(MainPage);
