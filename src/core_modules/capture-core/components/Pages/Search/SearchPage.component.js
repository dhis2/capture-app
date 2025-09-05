// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconChevronLeft24, spacers, colors } from '@dhis2/ui';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import type { Props, PlainProps } from './searchPage.types';
import { TopBar } from './TopBar.container';
import { SearchBox } from '../../SearchBox';
import { TemplateSelector } from '../../TemplateSelector';
import { WidgetBulkDataEntry } from '../../WidgetBulkDataEntry';
import { BulkDataEntry } from '../../BulkDataEntry';
import { bulkDataEntryBreadcrumbsKeys } from '../../Breadcrumbs/BulkDataEntryBreadcrumb';
import './searchPage.css';

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
});

const SearchPagePlain = ({
    programId,
    orgUnitId,
    onNavigateToMainPage,
    onCloseBulkDataEntryPlugin,
    onOpenBulkDataEntryPlugin,
    showBulkDataEntryPlugin,
    classes,
}: PlainProps) => (
    <>
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
                >
                    {i18n.t('Back')}
                </Button>

                <div className={classes.container}>
                    <div
                        id="left-column-search-page"
                        className={classNames(
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
    </>
);

export const SearchPageComponent: ComponentType<$Diff<Props, CssClasses>> = compose(withStyles(getStyles))(
    SearchPagePlain,
);
