// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconChevronLeft24, spacers, colors } from '@dhis2/ui';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import type { Props, PlainProps } from './searchPage.types';
import { TopBar } from './TopBar.container';
import { SearchBox } from '../../SearchBox';
import { TemplateSelector } from '../../TemplateSelector';
import { WidgetBatchDataEntry } from '../../WidgetBatchDataEntry';
import { BatchDataEntry } from '../../BatchDataEntry';
import { batchDataEntryBreadcrumbsKeys } from '../../Breadcrumbs/BatchDataEntryBreadcrumb';

const getStyles = () => ({
    backButton: {
        margin: spacers.dp16,
        padding: '0',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: `0 ${spacers.dp16} 0`,
        gap: spacers.dp16,
    },
    left: {
        flex: 1,
    },
    right: {
        width: '260px',
    },
    searchBoxWrapper: {
        height: 'fit-content',
        padding: spacers.dp16,
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
    },
});

const SearchPagePlain = ({
    programId,
    orgUnitId,
    onNavigateToMainPage,
    setShowBatchDataEntryPlugin,
    showBatchDataEntryPlugin,
    classes,
}: PlainProps) => (
    <>
        <TopBar programId={programId} orgUnitId={orgUnitId} />
        {showBatchDataEntryPlugin ? (
            <BatchDataEntry
                programId={programId}
                setShowBatchDataEntryPlugin={setShowBatchDataEntryPlugin}
                page={batchDataEntryBreadcrumbsKeys.SEARCH_PAGE}
            />
        ) : (
            <>
                <Button
                    icon={<IconChevronLeft24 />}
                    dataTest="back-button"
                    className={classes.backButton}
                    onClick={onNavigateToMainPage}
                >
                    {i18n.t('Back')}
                </Button>

                <div className={classes.container}>
                    <div className={`${classes.left} ${classes.searchBoxWrapper}`}>
                        <SearchBox programId={programId} />
                    </div>
                    <div className={classes.right}>
                        <TemplateSelector />
                        <br />
                        <WidgetBatchDataEntry
                            programId={programId}
                            setShowBatchDataEntryPlugin={setShowBatchDataEntryPlugin}
                        />
                    </div>
                </div>
            </>
        )}
    </>
);

export const SearchPageComponent: ComponentType<$Diff<Props, CssClasses>> = compose(withStyles(getStyles))(
    SearchPagePlain,
);
