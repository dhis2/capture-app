import React, { useState, useEffect, type ComponentType } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { spacers, colors, NoticeBox } from '@dhis2/ui';
import { capitalizeFirstLetter } from 'capture-core-utils/string';
import type { AvailableSearchOption, ComponentProps, Props, SearchGroups } from './SearchBox.types';
import { searchBoxStatus } from '../../reducers/descriptions/searchDomain.reducerDescription';
import { SearchForm } from './SearchForm';
import { TrackedEntityTypeSelector } from '../TrackedEntityTypeSelector';
import { withLoadingIndicator } from '../../HOC';
import { IncompleteSelectionsMessage } from '../IncompleteSelectionsMessage';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { searchScopes } from './SearchBox.constants';
import { useScopeTitleText, useScopeInfo } from '../../hooks';
import { useSearchOption } from './hooks';
import { SearchStatus } from './SearchStatus';
import { scopeTypes } from '../../metaData';

const getStyles: Readonly<any> = {
    half: {
        flex: 1,
    },
    title: {
        fontWeight: 500,
        fontSize: 15,
        color: colors.grey800,
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

function getInitialSearchScopeType(preselectedProgramId: Props['preselectedProgramId']) {
    return preselectedProgramId ? searchScopes.PROGRAM : null;
}

function renderTrackedEntityTypeSelector(args: {
    selectedSearchScopeType: string | null;
    handleSearchScopeSelection: (searchScopeId: string, searchType: keyof typeof scopeTypes) => void;
}) {
    if (args.selectedSearchScopeType === searchScopes.PROGRAM) {
        return null;
    }

    return (
        <TrackedEntityTypeSelector
            onSelect={args.handleSearchScopeSelection}
            footerText={i18n.t(
                'You can also select a program from the top bar to search within that program.',
            )}
        />
    );
}

function renderSearchForm(args: {
    selectedSearchScopeId: string;
    searchGroupsForSelectedScope: SearchGroups;
}) {
    if (!args.searchGroupsForSelectedScope) {
        return null;
    }

    return (
        <SearchForm
            selectedSearchScopeId={args.selectedSearchScopeId}
            searchGroupsForSelectedScope={args.searchGroupsForSelectedScope}
        />
    );
}

function renderFooterContent(args: {
    isLoading: boolean;
    searchStatus: string;
    selectedSearchScopeId: string | null | undefined;
    searchGroupsForSelectedScope: SearchGroups;
    availableSearchOption?: AvailableSearchOption;
    trackedEntityName: string;
}) {
    if (args.isLoading) {
        return <LoadingMaskElementCenter containerStyle={{ height: '100px' }} />;
    }

    const footerNodes: React.ReactNode[] = [];

    if (args.searchStatus === searchBoxStatus.INITIAL && !args.selectedSearchScopeId) {
        footerNodes.push(
            <IncompleteSelectionsMessage>
                {String(i18n.t('Choose a type to start searching'))}
            </IncompleteSelectionsMessage>,
        );
    }

    if (
        args.selectedSearchScopeId
        && args.availableSearchOption
        && !args.searchGroupsForSelectedScope.length
    ) {
        footerNodes.push(
            <NoticeBox
                warning
                title={i18n.t('{{trackedEntityName}} has no searchable attributes', {
                    trackedEntityName: capitalizeFirstLetter(args.trackedEntityName),
                    interpolation: { escapeValue: false },
                })}
            >
                {/* eslint-disable-next-line max-len */}
                {i18n.t('Try selecting a different tracked entity type, or try searching in a program by choosing one from the top bar.')}
            </NoticeBox>,
        );
    }

    return <>{footerNodes}</>;
}

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
    const [selectedSearchScopeType, setSelectedSearchScopeType] = useState(
        getInitialSearchScopeType(preselectedProgramId),
    );
    const { trackedEntityName } = useScopeInfo(selectedSearchScopeId ?? null);
    const titleText = useScopeTitleText(selectedSearchScopeId ?? null);
    const {
        searchOption: availableSearchOption,
        isLoading,
    } = useSearchOption({ programId: preselectedProgramId, trackedEntityTypeId });

    useEffect(() => {
        const scopeId = preselectedProgramId || trackedEntityTypeId;
        setSelectedSearchScopeId(scopeId);

        setSelectedSearchScopeType(getInitialSearchScopeType(preselectedProgramId));
    }, [trackedEntityTypeId, preselectedProgramId]);

    useEffect(() => {
        cleanSearchRelatedInfo();
        showInitialSearchBox();
    }, [cleanSearchRelatedInfo, showInitialSearchBox]);

    const searchGroupsForSelectedScope: SearchGroups = availableSearchOption?.searchGroups ?? [];

    const handleSearchScopeSelection = (searchScopeId: string, searchType: keyof typeof scopeTypes) => {
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
                                {renderTrackedEntityTypeSelector({
                                    selectedSearchScopeType,
                                    handleSearchScopeSelection,
                                })}

                                {renderSearchForm({
                                    selectedSearchScopeId: selectedSearchScopeId ?? '',
                                    searchGroupsForSelectedScope,
                                })}
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

            {renderFooterContent({
                isLoading,
                searchStatus,
                selectedSearchScopeId,
                searchGroupsForSelectedScope,
                availableSearchOption,
                trackedEntityName,
            })}
        </>
    );
};

const SearchBoxWithStyles = withStyles(getStyles)(Index);
export const SearchBoxComponent = withLoadingIndicator()(SearchBoxWithStyles) as ComponentType<ComponentProps>;
