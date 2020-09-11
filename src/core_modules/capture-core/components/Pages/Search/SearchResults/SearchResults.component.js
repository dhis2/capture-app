// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Pagination } from 'capture-ui';
import { Button } from '@dhis2/ui-core';
import { CardList } from '../../../CardList';
import withNavigation from '../../../Pagination/withDefaultNavigation';
import { searchScopes } from '../SearchPage.constants';
import type { Props } from './SearchResults.types';
import { navigateToTrackedEntityDashboard } from '../sharedUtils';

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
    openDashboardButton: {
        marginTop: 8,
    },
});

export type CardDataElementsInformation = Array<{| id: string, name: string |}>

export const SearchResultsComponent = ({
    searchViaAttributesOnScopeProgram,
    searchViaAttributesOnScopeTrackedEntityType,
    classes,
    searchResults,
    searchGroupsForSelectedScope,
    rowsCount,
    rowsPerPage,
    currentPage,
    currentSearchScopeType,
    currentSearchScopeId,
    currentFormId,
    currentSearchTerms,
}: Props) => {
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

    const GotoDashboardButton = ({ id, orgUnitId }) => {
        const scopeSearchParam = `${currentSearchScopeType.toLowerCase()}=${currentSearchScopeId}`;
        return (
            <div className={classes.openDashboardButton}>
                <Button
                    dataTest="dhis2-capture-view-dashboard-button"
                    onClick={() => navigateToTrackedEntityDashboard(id, orgUnitId, scopeSearchParam)}
                >
                    {i18n.t('View dashboard')}
                </Button>
            </div>
        );
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

    return (<>
        <div data-test="dhis2-capture-search-results-top" className={classes.topSection} >
            <b>{rowsCount}</b>
            &nbsp;{i18n.t('result(s) found for term(s)')}
            &nbsp;{currentSearchTerms.map(({ name, value, id }, index, rest) => (
                <div key={id}>
                    <i>{name}</i>: <b>{value}</b>
                    {index !== rest.length - 1 && <span>,</span>}
                    &nbsp;
                </div>))}
        </div>
        <div data-test="dhis2-capture-search-results-list">
            <CardList
                items={searchResults}
                dataElements={collectFormDataElements(searchGroupsForSelectedScope)}
                getCustomItemBottomElements={({ item }) => <GotoDashboardButton id={item.id} orgUnitId={item.tei.orgUnit} />}
            />
        </div>
        <div data-test="dhis2-capture-search-results-pagination" className={classes.pagination}>
            <SearchPagination
                onChangePage={newPage => handlePageChange(newPage)}
                rowsCount={rowsCount}
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
            />
        </div>
    </>);
};
