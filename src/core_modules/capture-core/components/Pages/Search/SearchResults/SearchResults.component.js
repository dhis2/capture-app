// @flow
import React, { type ComponentType, useContext } from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { Pagination } from 'capture-ui';
import { Button } from '@dhis2/ui';
import { CardList } from '../../../CardList';
import withNavigation from '../../../Pagination/withDefaultNavigation';
import { searchScopes } from '../SearchPage.constants';
import type { Props } from './SearchResults.types';
import { navigateToTrackedEntityDashboard } from '../sharedUtils';
import { availableCardListButtonState } from '../../../CardList/CardList.constants';
import { SearchResultsHeader } from '../../../SearchResultsHeader';
import { ResultsPageSizeContext } from '../../shared-contexts';

const SearchPagination = withNavigation()(Pagination);

export const getStyles = (theme: Theme) => ({
    pagination: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginLeft: theme.typography.pxToRem(8),
        width: theme.typography.pxToRem(600),
    },
});

const buttonStyles = (theme: Theme) => ({
    margin: {
        marginTop: theme.typography.pxToRem(8),
    },
    buttonMargin: {
        marginLeft: theme.typography.pxToRem(8),
    },
});

const CardListButtons = withStyles(buttonStyles)(
    ({
        currentSearchScopeId,
        currentSearchScopeType,
        id,
        orgUnitId,
        navigationButtonsState,
        programName,
        classes,
    }) => {
        const scopeSearchParam = `${currentSearchScopeType.toLowerCase()}=${currentSearchScopeId}`;
        return (
            <div className={classes.margin}>
                <Button
                    dataTest="dhis2-capture-view-dashboard-button"
                    onClick={() => navigateToTrackedEntityDashboard(id, orgUnitId, scopeSearchParam)}
                >
                    {i18n.t('View dashboard')}
                </Button>
                {
                    navigationButtonsState === availableCardListButtonState.SHOW_VIEW_ACTIVE_ENROLLMENT_BUTTON &&
                    <Button
                        className={classes.buttonMargin}
                        dataTest="dhis2-capture-view-active-enrollment-button"
                        onClick={() => navigateToTrackedEntityDashboard(id, orgUnitId, scopeSearchParam)}
                    >
                        {i18n.t('View active enrollment')}
                    </Button>
                }
                {
                    navigationButtonsState === availableCardListButtonState.SHOW_RE_ENROLLMENT_BUTTON &&
                    <Button
                        className={classes.buttonMargin}
                        dataTest="dhis2-capture-re-enrollment-button"
                        onClick={() => navigateToTrackedEntityDashboard(id, orgUnitId, scopeSearchParam)}
                    >
                        {i18n.t('Re-enroll')} {programName && `${i18n.t('in')} ${programName}`}
                    </Button>
                }
            </div>
        );
    });

export const SearchResultsIndex = ({
    searchViaAttributesOnScopeProgram,
    searchViaAttributesOnScopeTrackedEntityType,
    classes,
    searchResults,
    dataElements,
    currentPage,
    currentSearchScopeType,
    currentSearchScopeId,
    currentSearchScopeName,
    currentFormId,
    currentSearchTerms,
}: Props) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);

    const handlePageChange = (newPage) => {
        switch (currentSearchScopeType) {
        case searchScopes.PROGRAM:
            searchViaAttributesOnScopeProgram({
                programId: currentSearchScopeId,
                formId: currentFormId,
                page: newPage,
                resultsPageSize,
            });
            break;
        case searchScopes.TRACKED_ENTITY_TYPE:
            searchViaAttributesOnScopeTrackedEntityType({
                trackedEntityTypeId: currentSearchScopeId,
                formId: currentFormId,
                page: newPage,
                resultsPageSize,
            });
            break;
        default:
            break;
        }
    };

    const currentProgramId = (currentSearchScopeType === searchScopes.PROGRAM) ? currentSearchScopeId : '';
    return (<>
        <SearchResultsHeader currentSearchTerms={currentSearchTerms} currentSearchScopeName={currentSearchScopeName} />
        <CardList
            noItemsText={i18n.t('No results found')}
            currentSearchScopeName={currentSearchScopeName}
            currentProgramId={currentProgramId}
            items={searchResults}
            dataElements={dataElements}
            getCustomItemBottomElements={({ item, navigationButtonsState, programName }) => (
                <CardListButtons
                    programName={programName}
                    currentSearchScopeId={currentSearchScopeId}
                    currentSearchScopeType={currentSearchScopeType}
                    id={item.id}
                    orgUnitId={item.tei.orgUnit}
                    navigationButtonsState={navigationButtonsState}
                />
            )}
        />
        <div className={classes.pagination}>
            <SearchPagination
                nextPageButtonDisabled={searchResults.length < resultsPageSize}
                onChangePage={newPage => handlePageChange(newPage)}
                currentPage={currentPage}
            />
        </div>
    </>);
};

export const SearchResultsComponent: ComponentType<Props> = withStyles(getStyles)(SearchResultsIndex);
