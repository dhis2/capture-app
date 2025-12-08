import React, { useMemo, type ComponentType } from 'react';
import { colors, spacers } from '@dhis2/ui';
import { WithStyles, withStyles } from 'capture-core-utils/styles';
import { cx } from '@emotion/css';
import { bulkDataEntryBreadcrumbsKeys } from '../../../Breadcrumbs/BulkDataEntryBreadcrumb';
import type { ContainerProps } from './mainPageBody.types';
import { WorkingListsType } from './WorkingListsType';
import { MainPageStatuses } from '../shared/constants';
import { WithoutOrgUnitSelectedMessage } from './WithoutOrgUnitSelectedMessage/WithoutOrgUnitSelectedMessage';
import { WithoutCategorySelectedMessage } from './WithoutCategorySelectedMessage/WithoutCategorySelectedMessage';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../../HOC';
import { SearchBox } from '../../../SearchBox';
import { TemplateSelector } from '../../../TemplateSelector';
import { BulkDataEntry } from '../../../BulkDataEntry';
import { WidgetBulkDataEntry } from '../../../WidgetBulkDataEntry';
import {
    InvalidCategoryCombinationForOrgUnitMessage,
} from './InvalidCategoryCombinationForOrgUnitMessage/InvalidCategoryCombinationForOrgUnitMessage';
import { NoSelectionsInfoBox } from './NoSelectionsInfoBox';
import './mainPageBody.css';

const styles: Readonly<any> = {
    listContainer: {
        padding: 24,
        display: 'flex',
        gap: spacers.dp16,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacers.dp16,
        padding: spacers.dp16,
        containerType: 'inline-size',
    },
    leftColumn: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 740,
        minWidth: 740,
    },
    rightColumn: {
        flexGrow: 0,
        flexShrink: 0,
        width: 260,
    },
    searchBoxWrapper: {
        height: 'fit-content',
        padding: spacers.dp16,
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
    },
};

type Props = ContainerProps & WithStyles<typeof styles>;

const MainPageBodyPlain = ({
    programId,
    orgUnitId,
    trackedEntityTypeId,
    displayFrontPageList,
    selectedTemplateId,
    mainPageStatus,
    setShowAccessible,
    classes,
    onChangeTemplate,
    onCloseBulkDataEntryPlugin,
    onOpenBulkDataEntryPlugin,
    bulkDataEntryTrackedEntityIds,
}: Props) => {
    const showMainPage = useMemo(() => {
        const noProgramSelected = !programId;
        const noOrgUnitSelected = !orgUnitId;
        const isEventProgram = !trackedEntityTypeId;
        return noProgramSelected || noOrgUnitSelected || isEventProgram || displayFrontPageList || selectedTemplateId;
    }, [programId, orgUnitId, trackedEntityTypeId, displayFrontPageList, selectedTemplateId]);

    if (mainPageStatus === MainPageStatuses.SHOW_BULK_DATA_ENTRY_PLUGIN) {
        return (
            <BulkDataEntry
                programId={programId}
                onCloseBulkDataEntryPlugin={onCloseBulkDataEntryPlugin}
                displayFrontPageList={displayFrontPageList}
                page={bulkDataEntryBreadcrumbsKeys.MAIN_PAGE}
                trackedEntityIds={bulkDataEntryTrackedEntityIds}
            />
        );
    }

    return (
        <>
            {showMainPage ? (
                <>
                    {mainPageStatus === MainPageStatuses.DEFAULT && (
                        <NoSelectionsInfoBox />
                    )}
                    {mainPageStatus === MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED && (
                        <WithoutOrgUnitSelectedMessage programId={programId} setShowAccessible={setShowAccessible} />
                    )}
                    {mainPageStatus === MainPageStatuses.CATEGORY_OPTION_INVALID_FOR_ORG_UNIT && (
                        <InvalidCategoryCombinationForOrgUnitMessage />
                    )}
                    {mainPageStatus === MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED && (
                        <WithoutCategorySelectedMessage programId={programId} />
                    )}
                    {mainPageStatus === MainPageStatuses.SHOW_WORKING_LIST && (
                        <div className={classes.container} data-test={'main-page-working-list'}>
                            <div className={cx(classes.leftColumn, 'left-column-main-page')}>
                                <WorkingListsType
                                    programId={programId}
                                    orgUnitId={orgUnitId}
                                    selectedTemplateId={selectedTemplateId}
                                    onChangeTemplate={onChangeTemplate}
                                    onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
                                />
                            </div>
                            <div className={cx(classes.rightColumn, 'right-column-main-page')}>
                                <WidgetBulkDataEntry
                                    programId={programId}
                                    onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
                                />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className={classes.container}>
                    <div className={cx(classes.leftColumn, 'left-column-main-page', classes.searchBoxWrapper)}>
                        <SearchBox programId={programId} />
                    </div>
                    <div className={cx(classes.rightColumn, 'right-column-main-page')}>
                        <TemplateSelector />
                        <br />
                        <WidgetBulkDataEntry
                            programId={programId}
                            onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
                        />
                    </div>
                </div>
            )}
        </>
    );
};


const MainPageBodyWithStyles = withStyles(styles)(MainPageBodyPlain);
const MainPageBodyWithError = withErrorMessageHandler()(MainPageBodyWithStyles);
export const MainPageBody = withLoadingIndicator()(MainPageBodyWithError) as ComponentType<ContainerProps>;
