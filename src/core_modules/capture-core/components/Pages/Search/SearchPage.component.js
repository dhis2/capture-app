// @flow
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper/Paper';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
} from '@dhis2/ui-core';
import { LockedSelector } from '../../LockedSelector';
import type {
    AvailableSearchOptions,
    SelectedSearchScope,
    Props,
    TrackedEntityTypesWithCorrelatedPrograms,
} from './SearchPage.types';
import { searchPageStatus } from '../../../reducers/descriptions/searchPage.reducerDescription';
import { SearchForm } from './SearchForm';
import { LoadingMask } from '../../LoadingMasks';
import { SearchResults } from './SearchResults/SearchResults.container';
import { programCollection } from '../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../metaData/Program';
import { SearchDomainSelector } from './SearchDomainSelector';
import { addFormData } from '../../D2Form/actions/form.actions';
import { navigateToMainPage, showInitialViewOnSearchPage } from './SearchPage.actions';

export const searchScopes = {
    PROGRAM: 'PROGRAM',
    TRACKED_ENTITY_TYPE: 'TRACKED_ENTITY_TYPE',
};

export const getStyles = (theme: Theme) => ({
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

const buildSearchOption = (id, name, searchGroups, searchScope) => ({
    searchOptionId: id,
    searchOptionName: name,
    searchGroups: [...searchGroups.values()]
        // We sort so that we always have expanded the first search group section.
        .sort(({ unique: xBoolean }, { unique: yBoolean }) => {
            if (xBoolean === yBoolean) {
                return 0;
            }
            if (xBoolean) {
                return -1;
            }
            return 1;
        })
        .map(({ unique, searchForm, minAttributesRequiredToSearch }, index) => ({
            unique,
            searchForm,
            // We adding the `formId` here for the reason that we will use it in the SearchPage component.
            // Specifically the function `addFormData` will add an object for each input field to the store.
            // Also the formId is passed in the `Form` component and needs to be identical with the one in
            // the store in order for the `Form` to function. For these reasons we generate it once here.
            formId: `searchPageForm-${id}-${index}`,
            searchScope,
            minAttributesRequiredToSearch,
        })),
});

const useTrackedEntityTypesWithCorrelatedPrograms = (): TrackedEntityTypesWithCorrelatedPrograms =>
    useMemo(() =>
        [...programCollection.values()]
            .filter(program => program instanceof TrackerProgram)
            // $FlowFixMe
            .reduce((acc, {
                id: programId,
                name: programName,
                trackedEntityType: {
                    id: trackedEntityTypeId,
                    name: trackedEntityTypeName,
                    searchGroups: trackedEntityTypeSearchGroups,
                },
                searchGroups,
            }: TrackerProgram) => {
                const accumulatedProgramsOfTrackedEntityType =
            acc[trackedEntityTypeId] ? acc[trackedEntityTypeId].programs : [];
                return {
                    ...acc,
                    [trackedEntityTypeId]: {
                        trackedEntityTypeId,
                        trackedEntityTypeName,
                        trackedEntityTypeSearchGroups,
                        programs: [
                            ...accumulatedProgramsOfTrackedEntityType,
                            { programId, programName, searchGroups },
                        ],

                    },
                };
            }, {}),
    [],
    );

const useSearchOptions = (trackedEntityTypesWithCorrelatedPrograms): AvailableSearchOptions =>
    useMemo(() =>
        Object.values(trackedEntityTypesWithCorrelatedPrograms)
            // $FlowFixMe https://github.com/facebook/flow/issues/2221
            .reduce((acc, { trackedEntityTypeId, trackedEntityTypeName, trackedEntityTypeSearchGroups, programs }) => ({
                ...acc,
                [trackedEntityTypeId]:
                  buildSearchOption(
                      trackedEntityTypeId,
                      trackedEntityTypeName,
                      trackedEntityTypeSearchGroups,
                      searchScopes.TRACKED_ENTITY_TYPE,
                  ),
                ...programs.reduce((accumulated, { programId, programName, searchGroups }) => ({
                    ...accumulated,
                    [programId]:
                      buildSearchOption(
                          programId,
                          programName,
                          searchGroups,
                          searchScopes.PROGRAM,
                      ),
                }), {}),
            }), {}),
    [trackedEntityTypesWithCorrelatedPrograms],
    );

const usePreselectedSearchScope = (trackedEntityTypesWithCorrelatedPrograms): SelectedSearchScope => {
    const currentSelectionsId =
      useSelector(({ currentSelections }) => currentSelections.programId, isEqual);

    return useMemo(() => {
        const preselection = Object.values(trackedEntityTypesWithCorrelatedPrograms)
            // $FlowFixMe https://github.com/facebook/flow/issues/2221
            .map(({ programs }) =>
                programs.find(({ programId }) => programId === currentSelectionsId))
            .filter(program => program)[0];
        return {
            value: preselection && preselection.programId,
            label: preselection && preselection.programName,
        };
    }, [currentSelectionsId, trackedEntityTypesWithCorrelatedPrograms],
    );
};

export const SearchPageComponent = ({ classes, dispatch }: Props) => {
    const dispatchShowInitialSearchPage = useCallback(
        () => { dispatch(showInitialViewOnSearchPage()); },
        [dispatch]);
    const dispatchNavigateToMainPage = () => { dispatch(navigateToMainPage()); };

    const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();
    const availableSearchOptions = useSearchOptions(trackedEntityTypesWithCorrelatedPrograms);
    const preselectedProgram = usePreselectedSearchScope(trackedEntityTypesWithCorrelatedPrograms);

    const searchStatus: string =
      useSelector(({ searchPage }) => searchPage.searchStatus, isEqual);

    const generalPurposeErrorMessage: string =
      useSelector(({ searchPage }) => searchPage.generalPurposeErrorMessage, isEqual);
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

    useEffect(() => {
        const dispatchAddFormIdToReduxStore = (formId) => { dispatch(addFormData(formId)); };

        // in order for the Form component to render
        // a formId under the `forms` reducer needs to be added.
        searchGroupForSelectedScope
            .forEach(({ formId }) => {
                dispatchAddFormIdToReduxStore(formId);
            });
    },
    [
        searchGroupForSelectedScope,
        dispatch,
    ]);

    const handleSearchScopeSelection = ({ value, label }) => {
        dispatchShowInitialSearchPage();
        setSelectedSearchScope({ value, label });
    };

    return (<>
        <LockedSelector />
        <div data-test="dhis2-capture-search-page-content" className={classes.container}>
            <Button
                dataTest="dhis2-capture-back-button"
                className={classes.backButton}
                onClick={dispatchNavigateToMainPage}
            >
                <ChevronLeft />
                {i18n.t('Back')}
            </Button>

            <Paper className={classes.paper}>

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
                        <ModalTitle>{i18n.t('No results found')}</ModalTitle>
                        <ModalContent>
                            {i18n.t('You can change your search terms and search again to find what you are looking for.')}
                        </ModalContent>
                        <ModalActions>
                            <ButtonStrip end>
                                <Button
                                    disabled={searchStatus === searchPageStatus.LOADING}
                                    onClick={dispatchShowInitialSearchPage}
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
                        className={classes.generalPurposeErrorMessage}
                    >
                        {i18n.t(generalPurposeErrorMessage)}
                    </div>
                }
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
