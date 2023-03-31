// @flow
import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconChevronLeft24, spacers } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper/Paper';

import type { ComponentProps, Props } from './SearchBox.types';
import { searchBoxStatus } from '../../reducers/descriptions/searchDomain.reducerDescription';
import { SearchForm } from './SearchForm';
import { TrackedEntityTypeSelector } from '../TrackedEntityTypeSelector';
import { withErrorMessageHandler, withLoadingIndicator } from '../../HOC';
import { IncompleteSelectionsMessage } from '../IncompleteSelectionsMessage';
import { searchScopes } from './SearchBox.constants';
import { useScopeTitleText } from '../../hooks/useScopeTitleText';
import { cleanFallbackRelatedData } from './SearchBox.actions';
import { TemplateSelector } from './TemplateSelector';
import { useSearchOption, useFallbackTriggered } from './hooks';
import { SearchStatus } from './SearchStatus';

const getStyles = (theme: Theme) => ({
    half: {
        flex: 1,
    },
    quarter: {
        flex: 0.4,
    },
    title: {
        padding: '8px 0 0px 8px',
        fontWeight: 500,
        marginBottom: theme.typography.pxToRem(16),
    },
    container: {
        padding: '10px 24px 24px 24px',
    },
    innerContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacers.dp16,
    },
    paper: {
        padding: theme.typography.pxToRem(10),
        flex: 1,
    },
    emptySelectionPaperContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
    },
    backButton: {
        marginBottom: 10,
    },
});

const Index = ({
    showInitialSearchBox,
    navigateToMainPage,
    cleanSearchRelatedInfo,
    classes,
    preselectedProgramId,
    searchStatus,
    trackedEntityTypeId,
    navigateToRegisterUser,
    minAttributesRequiredToSearch,
    searchableFields,
}: Props) => {
    const [selectedSearchScopeId, setSearchScopeId] = useState(preselectedProgramId);
    const [selectedSearchScopeType, setSearchScopeType] = useState(preselectedProgramId ? searchScopes.PROGRAM : null);
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
                {navigateToMainPage && (
                    <Button dataTest="back-button" className={classes.backButton} onClick={navigateToMainPage}>
                        <IconChevronLeft24 />
                        {i18n.t('Back')}
                    </Button>
                )}
                <div className={classes.innerContainer}>
                    <Paper className={classes.paper}>
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
                                    navigateToRegisterUser={navigateToRegisterUser}
                                    showInitialSearchBox={showInitialSearchBox}
                                    fallbackTriggered={fallbackTriggered}
                                />
                            </div>
                        </div>
                    </Paper>
                    <div className={classes.quarter}>
                        <TemplateSelector />
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
    withErrorMessageHandler(),
    withStyles(getStyles),
)(Index);
