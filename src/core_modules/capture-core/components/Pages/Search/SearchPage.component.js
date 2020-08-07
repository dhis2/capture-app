// @flow
import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper/Paper';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
} from '@dhis2/ui-core';
import { LockedSelector } from '../../LockedSelector';
import type { ContainerProps, Props } from './SearchPage.types';
import { searchPageStatus } from '../../../reducers/descriptions/searchPage.reducerDescription';
import { SearchForm } from './SearchForm';
import { LoadingMask } from '../../LoadingMasks';
import { SearchResults } from './SearchResults/SearchResults.container';
import { SearchDomainSelector } from './SearchDomainSelector';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';

export const searchScopes = {
    PROGRAM: 'PROGRAM',
    TRACKED_ENTITY_TYPE: 'TRACKED_ENTITY_TYPE',
};

const getStyles = (theme: Theme) => ({
    maxWidth: {
        maxWidth: theme.typography.pxToRem(950),
    },
    container: {
        padding: '10px 24px 24px 24px',
    },
    paper: {
        marginBottom: theme.typography.pxToRem(10),
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
    generalPurposeErrorMessage: {
        color: theme.palette.error.main,
    },
    loadingMask: {
        display: 'flex',
        justifyContent: 'center',
    },
});

const Index = ({
    dispatchShowInitialSearchPage,
    dispatchNavigateToMainPage,
    classes,
    trackedEntityTypesWithCorrelatedPrograms,
    availableSearchOptions,
    preselectedProgram,
    searchStatus,
    generalPurposeErrorMessage,
}: Props) => {
    const [selectedSearchScope, setSelectedSearchScope] = useState(() => preselectedProgram);

    useEffect(() => {
        if (!preselectedProgram.value) {
            dispatchShowInitialSearchPage();
        }
    },
    [
        preselectedProgram.value,
        dispatchShowInitialSearchPage,
    ]);

    const searchGroupForSelectedScope =
      (selectedSearchScope.value ? availableSearchOptions[selectedSearchScope.value].searchGroups : []);

    const handleSearchScopeSelection = (program) => {
        dispatchShowInitialSearchPage();
        setSelectedSearchScope(program);
    };

    return (<>
        <LockedSelector />
        <div data-test="dhis2-capture-search-page-content" className={classes.container} >
            <Button
                dataTest="dhis2-capture-back-button"
                className={classes.backButton}
                onClick={dispatchNavigateToMainPage}
            >
                <ChevronLeft />
                {i18n.t('Back')}
            </Button>

            <Paper className={classes.paper}>
                <div className={classes.maxWidth}>
                    <SearchDomainSelector
                        trackedEntityTypesWithCorrelatedPrograms={trackedEntityTypesWithCorrelatedPrograms}
                        onSelect={handleSearchScopeSelection}
                        selectedSearchScope={selectedSearchScope}
                    />

                    <SearchForm
                        selectedSearchScopeId={selectedSearchScope.value}
                        searchGroupForSelectedScope={searchGroupForSelectedScope}
                    />

                    {
                        searchStatus === searchPageStatus.SHOW_RESULTS &&
                        <SearchResults searchGroupForSelectedScope={searchGroupForSelectedScope} />
                    }

                    {
                        searchStatus === searchPageStatus.NO_RESULTS &&
                        <Modal position="middle">
                            <ModalTitle>Empty results</ModalTitle>
                            <ModalContent>There was no item found</ModalContent>
                            <ModalActions>
                                <ButtonStrip end>
                                    <Button
                                        disabled={searchStatus === searchPageStatus.LOADING}
                                        onClick={dispatchShowInitialSearchPage}
                                        type="button"
                                    >
                                        Search Again
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
                            className={classes.generalPurposeErrorMessage}
                        >
                            {generalPurposeErrorMessage}
                        </div>
                    }
                </div>
            </Paper>

            {
                searchStatus === searchPageStatus.INITIAL && !selectedSearchScope.value &&
                    <Paper elevation={0} data-test={'dhis2-capture-informative-paper'}>
                        <div className={classes.emptySelectionPaperContent}>
                            {i18n.t('Make a selection to start searching')}
                        </div>
                    </Paper>
            }
        </div>
    </>);
};

export const SearchPageComponent: ComponentType<ContainerProps> =
  compose(
      withLoadingIndicator(),
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(Index);
