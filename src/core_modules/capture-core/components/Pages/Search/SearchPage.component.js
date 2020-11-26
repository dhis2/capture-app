// @flow
import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper/Paper';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { useLocation } from 'react-router';
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    NoticeBox,
} from '@dhis2/ui';
import { LockedSelector } from '../../LockedSelector';
import type { ContainerProps, Props } from './SearchPage.types';
import { searchPageStatus } from '../../../reducers/descriptions/searchPage.reducerDescription';
import { SearchForm } from './SearchForm';
import { LoadingMask } from '../../LoadingMasks';
import { SearchResults } from './SearchResults/SearchResults.container';
import { TrackedEntityTypeSelector } from '../../TrackedEntityTypeSelector';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { InefficientSelectionsMessage } from '../../InefficientSelectionsMessage';
import { searchScopes } from './SearchPage.constants';
import { ResultsPageSizeContext } from '../shared-contexts';
import { useScopeTitleText } from '../../../hooks/useScopeTitleText';
import { cleanFallbackRelatedData } from './SearchPage.actions';

const getStyles = (theme: Theme) => ({
    maxWidth: {
        maxWidth: theme.typography.pxToRem(950),
    },
    title: {
        padding: '10px 0 0px 10px',
        fontWeight: 500,
        marginBottom: theme.typography.pxToRem(16),
    },
    container: {
        padding: '10px 24px 24px 24px' },
    paper: {
        padding: theme.typography.pxToRem(10),
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
    informativeMessage: {
        marginLeft: theme.typography.pxToRem(10),
        marginTop: theme.typography.pxToRem(20),
        marginBottom: theme.typography.pxToRem(28),
        marginRight: theme.typography.pxToRem(10),
    },
    loadingMask: {
        display: 'flex',
        justifyContent: 'center',
    },
});

const useFallbackTriggered = (): boolean => {
    const defaultValue = { fallback: false };
    const { state: { fallback } = defaultValue } = useLocation();

    return fallback;
};

const Index = ({
    showInitialSearchPage,
    navigateToMainPage,
    cleanSearchRelatedInfo,
    classes,
    availableSearchOptions,
    preselectedProgramId,
    searchStatus,
    trackedEntityTypeId,
}: Props) => {
    const [selectedSearchScopeId, setSearchScopeId] = useState(preselectedProgramId);
    const [selectedSearchScopeType, setSearchScopeType] = useState(preselectedProgramId ? searchScopes.PROGRAM : null);
    const titleText = useScopeTitleText(selectedSearchScopeId);
    const fallbackTriggered = useFallbackTriggered();

    useEffect(() => {
        const scopeId = preselectedProgramId || trackedEntityTypeId;
        setSearchScopeId(scopeId);

        const type = preselectedProgramId ? searchScopes.PROGRAM : null;
        setSearchScopeType(type);
    },
    [
        trackedEntityTypeId,
        preselectedProgramId,
    ]);

    useEffect(() => {
        // This statement is here because when we trigger the fallback search,
        // we rerender the page without a preselectedProgramId.
        // This is triggering this hook. However the fallback search view needs
        // to start with a loading spinner and not with the initial view.
        if (!fallbackTriggered) {
            cleanFallbackRelatedData();
            showInitialSearchPage();
        }
        return () => {
            if (fallbackTriggered) {
                return cleanSearchRelatedInfo();
            }
            return undefined;
        };
    },
    [
        fallbackTriggered,
        cleanSearchRelatedInfo,
        preselectedProgramId,
        showInitialSearchPage,
    ]);

    const searchGroupsForSelectedScope =
      (selectedSearchScopeId ? availableSearchOptions[selectedSearchScopeId].searchGroups : []);


    const handleSearchScopeSelection = (searchScopeId, searchType) => {
        showInitialSearchPage();
        cleanSearchRelatedInfo();
        setSearchScopeId(searchScopeId);
        setSearchScopeType(searchType);
    };
    return (<>
        <ResultsPageSizeContext.Provider value={{ resultsPageSize: 5 }}>
            <LockedSelector />
            <div data-test="dhis2-capture-search-page-content" className={classes.container} >
                <Button
                    dataTest="dhis2-capture-back-button"
                    className={classes.backButton}
                    onClick={navigateToMainPage}
                >
                    <ChevronLeft />
                    {i18n.t('Back')}
                </Button>

                <Paper className={classes.paper}>
                    <div className={classes.maxWidth}>
                        <div className={classes.title} >
                            Find {titleText}
                        </div>
                        {
                            (selectedSearchScopeType !== searchScopes.PROGRAM) &&
                            <TrackedEntityTypeSelector onSelect={handleSearchScopeSelection} />
                        }

                        <SearchForm
                            fallbackTriggered={fallbackTriggered}
                            selectedSearchScopeId={selectedSearchScopeId}
                            searchGroupsForSelectedScope={searchGroupsForSelectedScope}
                        />

                        {
                            searchStatus === searchPageStatus.SHOW_RESULTS &&
                            <SearchResults
                                availableSearchOptions={availableSearchOptions}
                                fallbackTriggered={fallbackTriggered}
                            />
                        }

                        {
                            searchStatus === searchPageStatus.NO_RESULTS &&
                            <Modal position="middle">
                                <ModalTitle>{i18n.t('No results found')}</ModalTitle>
                                <ModalContent>
                                    {i18n.t('You can change your search terms and search again to find what you are looking for.')}
                                </ModalContent>
                                <ModalActions>
                                    <ButtonStrip end>
                                        <Button
                                            disabled={searchStatus === searchPageStatus.LOADING}
                                            onClick={showInitialSearchPage}
                                            type="button"
                                        >
                                            {i18n.t('Back to search')}
                                        </Button>
                                    </ButtonStrip>
                                </ModalActions>
                            </Modal>
                        }

                        {
                            searchStatus === searchPageStatus.LOADING &&
                            <div className={classes.loadingMask}>
                                <LoadingMask />
                            </div>
                        }

                        {
                            searchStatus === searchPageStatus.ERROR &&
                            <div
                                data-test="dhis2-capture-general-purpose-error-mesage"
                                className={classes.informativeMessage}
                            >
                                <NoticeBox
                                    title={i18n.t('An error has occurred')}
                                    error
                                >
                                    {i18n.t('There is a problem with this search, please change the search terms or try again later. For more details open the Console tab of the Developer tools')}
                                </NoticeBox>
                            </div>
                        }

                        {
                            searchStatus === searchPageStatus.TOO_MANY_RESULTS &&
                            <div
                                data-test="dhis2-capture-general-purpose-too-many-results-mesage"
                                className={classes.informativeMessage}
                            >
                                <NoticeBox
                                    title={i18n.t('Too many results')}
                                    warning
                                >
                                    {i18n.t('This search returned too many results to show. Try changing search terms or searching by more attributes to narrow down the results.')}
                                </NoticeBox>
                            </div>

                        }
                    </div>
                </Paper>

            </div>
            {
                searchStatus === searchPageStatus.INITIAL && !selectedSearchScopeId &&
                    <InefficientSelectionsMessage
                        message={i18n.t('Choose a type to start searching')}
                    />
            }
        </ResultsPageSizeContext.Provider>
    </>);
};

export const SearchPageComponent: ComponentType<ContainerProps> =
  compose(
      withLoadingIndicator(),
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(Index);
