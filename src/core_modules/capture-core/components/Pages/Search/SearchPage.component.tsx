import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconChevronLeft24, spacers, colors } from '@dhis2/ui';
import { withStyles, type WithStyles, createStyles } from '@material-ui/core';
import type { Props } from './searchPage.types';
import { TopBar } from './TopBar.container';
import { SearchBox } from '../../SearchBox';
import { TemplateSelector } from '../../TemplateSelector';
import { WidgetBulkDataEntry } from '../../WidgetBulkDataEntry';
import { BulkDataEntry } from '../../BulkDataEntry';
import { bulkDataEntryBreadcrumbsKeys } from '../../Breadcrumbs/BulkDataEntryBreadcrumb';

const getStyles = () => createStyles({
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
    setShowBulkDataEntryPlugin,
    showBulkDataEntryPlugin,
    classes,
}: Props & WithStyles<typeof getStyles>) => (
    <>
        <TopBar programId={programId} orgUnitId={orgUnitId} />
        {showBulkDataEntryPlugin ? (
            <BulkDataEntry
                programId={programId}
                setShowBulkDataEntryPlugin={setShowBulkDataEntryPlugin}
                page={bulkDataEntryBreadcrumbsKeys.SEARCH_PAGE}
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
                        <WidgetBulkDataEntry
                            programId={programId}
                            setShowBulkDataEntryPlugin={setShowBulkDataEntryPlugin}
                        />
                    </div>
                </div>
            </>
        )}
    </>
);

export const SearchPageComponent =
    withStyles(getStyles)(SearchPagePlain) as ComponentType<Props>;
