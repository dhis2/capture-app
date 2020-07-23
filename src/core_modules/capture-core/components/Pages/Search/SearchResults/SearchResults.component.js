// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import { Pagination } from 'capture-ui';
import { Button } from '@dhis2/ui-core';
import CardList from '../../../CardList/CardList.component';
import withNavigation from '../../../Pagination/withDefaultNavigation';
import { searchScopes } from '../SearchPage.container';
import type { Props } from './SearchResults.types';
import { navigateToTrackedEntityDashboard } from '../sharedUtils';

const SearchPagination = withNavigation()(Pagination);

const getStyles = (theme: Theme) => ({
    pagination: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: 10,
    },
    topSection: {
        display: 'flex',
        flexDirection: 'row',
        margin: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
        backgroundColor: theme.palette.grey.lighter,
    },
    openDashboardButton: {
        marginTop: 10,
    },
});


export const Index = ({
    searchViaAttributesOnScopeProgram,
    searchViaAttributesOnScopeTrackedEntityType,
    classes,
    searchResults,
    searchGroupForSelectedScope,
    rowsCount,
    rowsPerPage,
    currentPage,
    currentSearchScopeType,
    currentSearchScopeId,
    currentFormId,
    searchValues,
}: Props) => {
    const handlePaginationChange = (searchScopeType, searchScopeId, formId, newPage) => {
        switch (searchScopeType) {
        case searchScopes.PROGRAM:
            searchViaAttributesOnScopeProgram({ programId: searchScopeId, formId, page: newPage });
            break;
        case searchScopes.TRACKED_ENTITY_TYPE:
            searchViaAttributesOnScopeTrackedEntityType({ trackedEntityTypeId: searchScopeId, formId });
            break;
        default:
            break;
        }
    };

    const viewTrackedEntityDashboard = ({ item: { id, tei: { orgUnit: orgUnitId } } }) => {
        const scopeSearchParam = `${currentSearchScopeType.toLowerCase()}=${currentSearchScopeId}`;
        return (
            <div className={classes.openDashboardButton}>
                <Button primary onClick={() => navigateToTrackedEntityDashboard(id, orgUnitId, scopeSearchParam)}>
                    {i18n.t('View dashboard')}
                </Button>
            </div>
        );
    };

    const collectFormDataElements = searchGroups =>
        searchGroups
            .filter(searchGroup => !searchGroup.unique)
            .flatMap(({ searchForm: { sections } }) => {
                const elementsMap = [...sections.values()].map(section => section.elements)[0];
                return [...elementsMap.values()];
            });

    return (<>
        <div className={classes.topSection} >
            <b>{rowsCount}</b>
            &nbsp;{i18n.t('results found for')}
            &nbsp;{searchValues.map(({ name, value, id }, index, rest) => (
                <div key={id}>
                    <i>{name}</i>: <b>{value}</b>
                    {index !== rest.length - 1 && <span>,</span>}
                    &nbsp;
                </div>))}
        </div>
        <CardList
            items={searchResults}
            dataElements={collectFormDataElements(searchGroupForSelectedScope)}
            getCustomItemBottomElements={item => viewTrackedEntityDashboard(item)}
        />
        <div className={classes.pagination}>
            <SearchPagination
                onChangePage={newPage => handlePaginationChange(currentSearchScopeType, currentSearchScopeId, currentFormId, newPage)}
                rowsCount={rowsCount}
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
            />
        </div>
    </>);
};

export const SearchResultsComponent = withStyles(getStyles)(Index);
