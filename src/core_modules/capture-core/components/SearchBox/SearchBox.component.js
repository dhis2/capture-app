// @flow
import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacers, colors } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';

import type { ComponentProps, Props } from './SearchBox.types';
import { searchBoxStatus } from '../../reducers/descriptions/searchDomain.reducerDescription';
import { SearchForm } from './SearchForm';
import { TrackedEntityTypeSelector } from '../TrackedEntityTypeSelector';
import { withLoadingIndicator } from '../../HOC';
import { IncompleteSelectionsMessage } from '../IncompleteSelectionsMessage';
import { searchScopes } from './SearchBox.constants';
import { useScopeTitleText, useScopeInfo } from '../../hooks';
import { cleanFallbackRelatedData } from './SearchBox.actions';
import { useSearchOption, useFallbackTriggered } from './hooks';
import { SearchStatus } from './SearchStatus';

const getStyles = () => ({
    half: {
        flex: 1,
    },
    title: {
        fontWeight: 500,
        marginBottom: spacers.dp16,
    },
    container: {
        color: colors.grey900,
    },
    innerContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacers.dp16,
    },
    searchFormContainer: {
        flex: 1,
    },
    emptySelectionPaperContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
    },
});

const Index = ({
    showInitialSearchBox,
    cleanSearchRelatedInfo,
    classes,
    preselectedProgramId,
    searchStatus,
    trackedEntityTypeId,
    navigateToRegisterTrackedEntity,
    minAttributesRequiredToSearch,
    searchableFields,
}: Props) => {
    const [selectedSearchScopeId, setSearchScopeId] = useState(preselectedProgramId);
    const [selectedSearchScopeType, setSearchScopeType] = useState(preselectedProgramId ? searchScopes.PROGRAM : null);
    const { trackedEntityName } = useScopeInfo(selectedSearchScopeId);
    const titleText = useScopeTitleText(selectedSearchScopeId);
    const fallbackTriggered = useFallbackTriggered();
    const {
        searchOption: availableSearchOption,
    } = useSearchOption({ programId: preselectedProgramId, trackedEntityTypeId });

    useEffect(() => {
        const scopeId = preselectedProgramId || trackedEntityTypeId;
        setSearchScopeId(scopeId);

        const type = preselectedProgramId ? searchScopes.PROGRAM : null;
        setSearchScopeType(type);
    }, [trackedEntityTypeId, preselectedProgramId]);

    useEffect(() => {
        // This statement is here because when we trigger the fallback search,
        // we rerender the page without a preselectedProgramId.
        // This is triggering this hook. However the fallback search view needs
        // to start with a loading spinner and not with the initial view.
        if (!fallbackTriggered) {
            cleanFallbackRelatedData();
            showInitialSearchBox();
        }
        return () => {
            if (fallbackTriggered) {
                return cleanSearchRelatedInfo();
            }
            return undefined;
        };
    }, [fallbackTriggered, cleanSearchRelatedInfo, preselectedProgramId, showInitialSearchBox]);

    const searchGroupsForSelectedScope = availableSearchOption?.searchGroups ?? [];

    const handleSearchScopeSelection = (searchScopeId, searchType) => {
        showInitialSearchBox();
        cleanSearchRelatedInfo();
        setSearchScopeId(searchScopeId);
        setSearchScopeType(searchType);
    };

    return (
        <>
            <div data-test="search-page-content" className={classes.container}>
                <div className={classes.innerContainer}>
                    <div className={classes.searchFormContainer}>
                        <div className={classes.title}>
                            {i18n.t('Search for {{titleText}}', { titleText, interpolation: { escapeValue: false } })}
                        </div>
                        <div>
                            <div className={classes.half}>
                                {selectedSearchScopeType !== searchScopes.PROGRAM && (
                                    <TrackedEntityTypeSelector
                                        onSelect={handleSearchScopeSelection}
                                        headerText={i18n.t('Search for')}
                                        footerText={i18n.t(
                                            'You can also choose a program from the top bar and search in that program',
                                        )}
                                    />
                                )}

                                {searchGroupsForSelectedScope && (
                                    <SearchForm
                                        fallbackTriggered={fallbackTriggered}
                                        selectedSearchScopeId={selectedSearchScopeId}
                                        searchGroupsForSelectedScope={searchGroupsForSelectedScope}
                                    />
                                )}
                                <SearchStatus
                                    searchStatus={searchStatus}
                                    availableSearchOption={availableSearchOption}
                                    minAttributesRequiredToSearch={minAttributesRequiredToSearch}
                                    searchableFields={searchableFields}
                                    navigateToRegisterTrackedEntity={navigateToRegisterTrackedEntity}
                                    showInitialSearchBox={showInitialSearchBox}
                                    fallbackTriggered={fallbackTriggered}
                                    trackedEntityName={trackedEntityName}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {searchStatus === searchBoxStatus.INITIAL && !selectedSearchScopeId && (
                <IncompleteSelectionsMessage>{i18n.t('Choose a type to start searching')}</IncompleteSelectionsMessage>
            )}
        </>
    );
};

export const SearchBoxComponent: ComponentType<ComponentProps> = compose(
    withLoadingIndicator(),
    withStyles(getStyles),
)(Index);
