import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconChevronLeft24, spacers, colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { cx } from '@emotion/css';
import type { Props } from './searchPage.types';
import { TopBar } from './TopBar.container';
import { SearchBox } from '../../SearchBox';
import { TemplateSelector } from '../../TemplateSelector';
import { WidgetBulkDataEntry } from '../../WidgetBulkDataEntry';
import { BulkDataEntry } from '../../BulkDataEntry';
import { bulkDataEntryBreadcrumbsKeys } from '../../Breadcrumbs/BulkDataEntryBreadcrumb';
import './searchPage.css';

const styles = {
    containerBulkDataEntry: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        height: 'calc(100vh - 48px)',
        '@supports (-webkit-touch-callout: none)': {
            height: 'calc(100vh - 148px)',
        },
    },
    backButton: {
        margin: spacers.dp16,
        marginBottom: spacers.dp12,
        padding: '0',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: `0 ${spacers.dp16} 0`,
        gap: spacers.dp12,
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
        padding: spacers.dp12,
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
    },
};

const SearchPagePlain = ({
    programId,
    orgUnitId,
    onNavigateToMainPage,
    onCloseBulkDataEntryPlugin,
    onOpenBulkDataEntryPlugin,
    showBulkDataEntryPlugin,
    classes,
}: Props & WithStyles<typeof styles>) => (
    <div
        className={cx({
            [classes.containerBulkDataEntry]: showBulkDataEntryPlugin,
        })}
    >
        <TopBar programId={programId} orgUnitId={orgUnitId} />
        {showBulkDataEntryPlugin ? (
            <BulkDataEntry
                programId={programId}
                onCloseBulkDataEntryPlugin={onCloseBulkDataEntryPlugin}
                page={bulkDataEntryBreadcrumbsKeys.SEARCH_PAGE}
            />
        ) : (
            <>
                <Button
                    icon={<IconChevronLeft24 />}
                    dataTest="back-button"
                    className={classes.backButton}
                    onClick={onNavigateToMainPage}
                    small
                >
                    {i18n.t('Back')}
                </Button>

                <div className={classes.container}>
                    <div
                        id="left-column-search-page"
                        className={cx(
                            classes.leftColumn,
                            classes.searchBoxWrapper,
                        )}
                    >
                        <SearchBox programId={programId} />
                    </div>
                    <div id="right-column-search-page" className={classes.rightColumn}>
                        <TemplateSelector />
                        <br />
                        <WidgetBulkDataEntry
                            programId={programId}
                            onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
                        />
                    </div>
                </div>
            </>
        )}
    </div>
);

export const SearchPageComponent =
    withStyles(styles)(SearchPagePlain) as ComponentType<Props>;
