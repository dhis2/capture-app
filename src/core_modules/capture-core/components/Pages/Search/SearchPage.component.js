// @flow
import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    CircularLoader,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    NoticeBox,
    IconChevronLeft24,
    spacers,
} from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper/Paper';
import { useLocation } from 'react-router-dom';

import type { ContainerProps, Props } from './SearchPage.types';
import { searchPageStatus } from '../../../reducers/descriptions/searchPage.reducerDescription';
import { SearchForm } from './SearchForm';
import { SearchResults } from './SearchResults';
import { TrackedEntityTypeSelector } from '../../TrackedEntityTypeSelector';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { IncompleteSelectionsMessage } from '../../IncompleteSelectionsMessage';
import { searchScopes } from './SearchPage.constants';
import { useScopeTitleText } from '../../../hooks/useScopeTitleText';
import { cleanFallbackRelatedData } from './SearchPage.actions';
import { TemplateSelector } from './TemplateSelector';

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
    availableSearchOption,
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
            showInitialSearchPage();
        }
        return () => {
            if (fallbackTriggered) {
                return cleanSearchRelatedInfo();
            }
            return undefined;
        };
    }, [fallbackTriggered, cleanSearchRelatedInfo, preselectedProgramId, showInitialSearchPage]);

    const searchGroupsForSelectedScope = availableSearchOption?.searchGroups ?? [];

    const handleSearchScopeSelection = (searchScopeId, searchType) => {
        showInitialSearchPage();
        cleanSearchRelatedInfo();
        setSearchScopeId(searchScopeId);
        setSearchScopeType(searchType);
    };

    const renderNotEnoughAttributesMessage = () => {
        const searchableFieldsDisplayname = searchableFields?.map(field => field.formName)?.join(', ');

        if (minAttributesRequiredToSearch === searchableFields.length && searchableFields.length > 1) {
            return i18n.t('Fill in these fields to search{{escape}} {{ searchableAttributes }}', {
                escape: ':',
                searchableAttributes: searchableFieldsDisplayname,
                interpolation: {
                    escape: false,
                },
            });
        }
        if (searchableFields.length > 1) {
            return i18n.t('Fill in at least {{minAttributesRequiredToSearch}} of these fields to search{{escape}} {{searchableAttributes}}', {
                escape: ':',
                minAttributesRequiredToSearch,
                searchableAttributes: searchableFieldsDisplayname,
                interpolation: {
                    escape: false,
                },
            });
        }
        return i18n.t('Fill in this field to search{{escape}} {{searchableAttributes}}', {
            escape: ':',
            searchableAttributes: searchableFieldsDisplayname,
            interpolation: {
                escape: false,
            },
        });
    };

    const searchStatusComponents = () => (
        <>
            {searchStatus === searchPageStatus.SHOW_RESULTS && (
                <SearchResults
                    availableSearchOption={availableSearchOption}
                    fallbackTriggered={fallbackTriggered}
                />
            )}

            {searchStatus === searchPageStatus.NO_RESULTS && (
                <Modal position="middle">
                    <ModalTitle>{i18n.t('No results found')}</ModalTitle>
                    <ModalContent>
                        {i18n.t('You can change your search terms and search again to find what you are looking for.')}
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button type="button" onClick={navigateToRegisterUser}>
                                {i18n.t('Register a user')}
                            </Button>
                            <Button
                                disabled={searchStatus === searchPageStatus.LOADING}
                                onClick={showInitialSearchPage}
                                primary
                            >
                                {i18n.t('Back to search')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
            {searchStatus === searchPageStatus.LOADING && (
                <div className={classes.loadingMask}>
                    <CircularLoader />
                </div>
            )}

            {searchStatus === searchPageStatus.ERROR && (
                <div data-test="general-purpose-error-mesage" className={classes.informativeMessage}>
                    <NoticeBox title={i18n.t('An error has occurred')} error>
                        There is a problem with this search, please change the search terms or try again later. For
                        more details open the Console tab of the Developer tools
                    </NoticeBox>
                </div>
            )}

            {searchStatus === searchPageStatus.TOO_MANY_RESULTS && (
                <div data-test="general-purpose-too-many-results-mesage" className={classes.informativeMessage}>
                    <NoticeBox title={i18n.t('Too many results')} warning>
                        {i18n.t(
                            'This search returned too many results to show. Try changing search terms or searching ' +
                            'by more attributes to narrow down the results.',
                        )}
                    </NoticeBox>
                </div>
            )}

            {searchStatus === searchPageStatus.NOT_ENOUGH_ATTRIBUTES && (
                <Modal position="middle">
                    <ModalTitle>{i18n.t('Cannot search in all programs')}</ModalTitle>
                    <ModalContent>{renderNotEnoughAttributesMessage()}</ModalContent>
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
            )}
        </>
    );

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
                                {searchStatusComponents()}
                            </div>
                        </div>
                    </Paper>
                    <div className={classes.quarter}>
                        <TemplateSelector />
                    </div>
                </div>
            </div>

            {searchStatus === searchPageStatus.INITIAL && !selectedSearchScopeId && (
                <IncompleteSelectionsMessage>{i18n.t('Choose a type to start searching')}</IncompleteSelectionsMessage>
            )}
        </>
    );
};

export const SearchPageComponent: ComponentType<ContainerProps> = compose(
    withLoadingIndicator(),
    withErrorMessageHandler(),
    withStyles(getStyles),
)(Index);
