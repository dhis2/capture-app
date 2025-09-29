import React, { useState, useEffect, type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { spacers, colors } from '@dhis2/ui';

import type { ComponentProps, Props } from './SearchBox.types';
import { searchBoxStatus } from '../../reducers/descriptions/searchDomain.reducerDescription';
import { SearchForm } from './SearchForm';
import { TrackedEntityTypeSelector } from '../TrackedEntityTypeSelector';
import { withLoadingIndicator } from '../../HOC';
import { IncompleteSelectionsMessage } from '../IncompleteSelectionsMessage';
import { searchScopes } from './SearchBox.constants';
import { useScopeTitleText, useScopeInfo } from '../../hooks';
import { useSearchOption } from './hooks';
import { SearchStatus } from './SearchStatus';

const getStyles: Readonly<any> = {
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
};

// eslint-disable-next-line complexity
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
}: Props & WithStyles<typeof getStyles>) => {
    const [selectedSearchScopeId, setSelectedSearchScopeId] = useState(preselectedProgramId);
    const [selectedSearchScopeType, setSelectedSearchScopeType] = useState(preselectedProgramId ? searchScopes.PROGRAM : null);
    const { trackedEntityName } = useScopeInfo(selectedSearchScopeId ?? null);
    const titleText = useScopeTitleText(selectedSearchScopeId ?? null);
    const {
        searchOption: availableSearchOption,
    } = useSearchOption({ programId: preselectedProgramId, trackedEntityTypeId });

    useEffect(() => {
        const scopeId = preselectedProgramId || trackedEntityTypeId;
        setSelectedSearchScopeId(scopeId);

        const type = preselectedProgramId ? searchScopes.PROGRAM : null;
        setSelectedSearchScopeType(type);
    }, [trackedEntityTypeId, preselectedProgramId]);

    useEffect(() => {
        cleanSearchRelatedInfo();
        showInitialSearchBox();
    }, [cleanSearchRelatedInfo, showInitialSearchBox]);

    const searchGroupsForSelectedScope = availableSearchOption?.searchGroups ?? [];
    const filteredUnsupportedAttributes = availableSearchOption?.filteredUnsupportedAttributes ?? [];

    const handleSearchScopeSelection = (searchScopeId: string, searchType: any) => {
        showInitialSearchBox();
        cleanSearchRelatedInfo();
        setSelectedSearchScopeId(searchScopeId);
        setSelectedSearchScopeType(searchType);
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
                                        selectedSearchScopeId={selectedSearchScopeId ?? ''}
                                        searchGroupsForSelectedScope={searchGroupsForSelectedScope}
                                        filteredUnsupportedAttributes={filteredUnsupportedAttributes}
                                    />
                                )}
                                <SearchStatus
                                    searchStatus={searchStatus}
                                    availableSearchOption={availableSearchOption}
                                    minAttributesRequiredToSearch={minAttributesRequiredToSearch}
                                    searchableFields={searchableFields}
                                    navigateToRegisterTrackedEntity={navigateToRegisterTrackedEntity}
                                    showInitialSearchBox={showInitialSearchBox}
                                    trackedEntityName={trackedEntityName}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {searchStatus === searchBoxStatus.INITIAL && !selectedSearchScopeId && (
                <IncompleteSelectionsMessage>{String(i18n.t('Choose a type to start searching'))}</IncompleteSelectionsMessage>
            )}
        </>
    );
};

const SearchBoxWithStyles = withStyles(getStyles)(Index);
export const SearchBoxComponent = withLoadingIndicator()(SearchBoxWithStyles) as ComponentType<ComponentProps>;
