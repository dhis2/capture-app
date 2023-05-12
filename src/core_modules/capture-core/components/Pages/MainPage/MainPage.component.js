// @flow
import React, { type ComponentType, useMemo } from 'react';
import { compose } from 'redux';
import { spacers } from '@dhis2/ui';
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
    },
    half: {
        flex: 1,
    },
    quarter: {
        flex: 0.4,
        padding: `${spacers.dp12} ${spacers.dp24} ${spacers.dp24} 0`,
    },
});

const useShowMainPage = ({ programId, orgUnitId, trackedEntityTypeId, displayFrontPageList, selectedTemplateId }) =>
    useMemo(() => {
        const noProgramSelected = !programId;
        const noOrgUnitSelected = !orgUnitId;
        const isEventProgram = !trackedEntityTypeId;

        return noProgramSelected || noOrgUnitSelected || isEventProgram || displayFrontPageList || selectedTemplateId;
    }, [programId, orgUnitId, trackedEntityTypeId, displayFrontPageList, selectedTemplateId]);

const MainPagePlain = ({
    MainPageStatus,
    setShowAccessible,
    programId,
    orgUnitId,
    trackedEntityTypeId,
    displayFrontPageList,
    selectedTemplateId,
    selectedCategories,
    classes,
    ...passOnProps
}: PlainProps) => {
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
            <>
                {showMainPage ? (
                    <>
                        {MainPageStatus === MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED && (
                            <WithoutOrgUnitSelectedMessage
                                programId={programId}
                                setShowAccessible={setShowAccessible}
                            />
                        )}
                        {MainPageStatus === MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED && (
                            <WithoutCategorySelectedMessage programId={programId} />
                        )}
                        {MainPageStatus === MainPageStatuses.SHOW_WORKING_LIST && (
                            <div className={classes.listContainer} data-test={'main-page-working-list'}>
                                <WorkingListsType
                                    programId={programId}
                                    selectedTemplateId={selectedTemplateId}
                                    orgUnitId={orgUnitId}
                                    {...passOnProps}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className={classes.container}>
                        <div className={classes.half}>
                            <SearchBox />
                        </div>
                        <div className={classes.quarter}>
                            <TemplateSelector />
                        </div>
                    </div>
                )}
            </>
        </>
    );
};

export const MainPageComponent: ComponentType<$Diff<Props, CssClasses>> = compose(
    withLoadingIndicator(),
    withErrorMessageHandler(),
    withStyles(getStyles),
)(MainPagePlain);
