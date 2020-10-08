// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { Pagination } from 'capture-ui';
import { Button } from '@dhis2/ui-core';
import { CardList } from '../../../CardList';
import withNavigation from '../../../Pagination/withDefaultNavigation';
import { searchScopes } from '../SearchPage.constants';
import type { CardDataElementsInformation, Props } from './SearchResults.types';
import { navigateToTrackedEntityDashboard } from '../sharedUtils';
import { availableCardListButtonState } from '../../../CardList/CardList.constants';

const SearchPagination = withNavigation()(Pagination);

export const getStyles = (theme: Theme) => ({
    pagination: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginLeft: theme.typography.pxToRem(8),
        width: theme.typography.pxToRem(600),
    },
    topSection: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: theme.typography.pxToRem(20),
        marginLeft: theme.typography.pxToRem(10),
        marginRight: theme.typography.pxToRem(10),
        marginBottom: theme.typography.pxToRem(10),
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
    searchGroupsForSelectedScope,
    currentPage,
    currentSearchScopeType,
    currentSearchScopeId,
    currentSearchScopeName,
    currentFormId,
    currentSearchTerms,
    nextPageButtonDisabled,
}: Props & CssClasses) => {
    const handlePageChange = (newPage) => {
        switch (currentSearchScopeType) {
        case searchScopes.PROGRAM:
            searchViaAttributesOnScopeProgram({ programId: currentSearchScopeId, formId: currentFormId, page: newPage });
            break;
        case searchScopes.TRACKED_ENTITY_TYPE:
            searchViaAttributesOnScopeTrackedEntityType({ trackedEntityTypeId: currentSearchScopeId, formId: currentFormId, page: newPage });
            break;
        default:
            break;
        }
    };

    const collectFormDataElements = (searchGroups): CardDataElementsInformation =>
        searchGroups
            .filter(searchGroup => !searchGroup.unique)
            .flatMap(({ searchForm: { sections } }) => {
                const elementsMap = [...sections.values()]
                    .map(section => section.elements)[0];
                return [...elementsMap.values()]
                    .map(({ id, name }) => ({ id, name }));
            });

    const currentProgramId = (currentSearchScopeType === searchScopes.PROGRAM) ? currentSearchScopeId : undefined;
    return (<>
        <div data-test="dhis2-capture-search-results-top" className={classes.topSection} >
            &nbsp;{i18n.t('Result(s) found for term(s)')} {currentSearchScopeName && `${i18n.t('in')} ${currentSearchScopeName}`}.
            &nbsp;{currentSearchTerms.map(({ name, value, id }, index, rest) => (
                <div key={id}>
                    <i>{name}</i>: <b>{value}</b>
                    {index !== rest.length - 1 && <span>,</span>}
                    &nbsp;
                </div>))}
        </div>
        <div data-test="dhis2-capture-search-results-list">
            <CardList
                noItemsText={i18n.t('No results found')}
                currentSearchScopeName={currentSearchScopeName}
                currentProgramId={currentProgramId}
                items={searchResults}
                dataElements={collectFormDataElements(searchGroupsForSelectedScope)}
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
        </div>
        <div data-test="dhis2-capture-search-results-pagination" className={classes.pagination}>
            <SearchPagination
                nextPageButtonDisabled={nextPageButtonDisabled}
                onChangePage={newPage => handlePageChange(newPage)}
                currentPage={currentPage}
            />
        </div>
    </>);
};

export const SearchResultsComponent: ComponentType<Props> = withStyles(getStyles)(SearchResultsIndex);
