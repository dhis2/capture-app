// @flow
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { useSelector, useDispatch } from 'react-redux';
import { compose } from 'redux';
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
import { navigateToMainPage, showInitialSearchPage } from './SearchPage.actions';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';

export const searchScopes = {
    PROGRAM: 'PROGRAM',
    TRACKED_ENTITY_TYPE: 'TRACKED_ENTITY_TYPE',
};

const getStyles = (theme: Theme) => ({
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

const Index = ({ classes }: Props) => {
    const dispatch = useDispatch();

    const dispatchShowInitialSearchPage = useCallback(
        () => { dispatch(showInitialSearchPage()); },
        [dispatch]);

    const dispatchNavigateToMainPage = () => { dispatch(navigateToMainPage()); };

    const trackedEntityTypesWithCorrelatedPrograms: TrackedEntityTypesWithCorrelatedPrograms =
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

    const searchOptions: AvailableSearchOptions =
      useMemo(() =>
          Object.values(trackedEntityTypesWithCorrelatedPrograms)
              // $FlowFixMe https://github.com/facebook/flow/issues/2221
              .reduce((acc, { trackedEntityTypeId, trackedEntityTypeName, trackedEntityTypeSearchGroups, programs }) =>
                  ({
                      ...acc,
                      [trackedEntityTypeId]:
                         buildSearchOption(
                             trackedEntityTypeId,
                             trackedEntityTypeName,
                             trackedEntityTypeSearchGroups,
                             searchScopes.TRACKED_ENTITY_TYPE,
                         ),
                      ...programs.reduce((acc2, { programId, programName, searchGroups }) => ({
                          ...acc2,
                          [programId]: buildSearchOption(programId, programName, searchGroups, searchScopes.PROGRAM),
                      }), {}),
                  }), {}),
      [trackedEntityTypesWithCorrelatedPrograms],
      );

    const searchStatus: string =
      useSelector(({ searchPage }) => searchPage.searchStatus, isEqual);

    const generalPurposeErrorMessage: string =
      useSelector(({ searchPage }) => searchPage.generalPurposeErrorMessage, isEqual);

    const preselectedProgram: SelectedSearchScope =
      useSelector(({ currentSelections }) => {
          const preselected = Object.values(trackedEntityTypesWithCorrelatedPrograms)
              // $FlowFixMe https://github.com/facebook/flow/issues/2221
              .map(({ programs }) => programs.find(({ programId }) => programId === currentSelections.programId))
              .filter(program => program)[0];
          return {
              value: preselected && preselected.programId,
              label: preselected && preselected.programName,
          };
      }, isEqual);

    const [selectedSearchScope, setSelectedSearchScope] = useState(preselectedProgram);

    const searchGroupForSelectedScope =
      (selectedSearchScope.value ? searchOptions[selectedSearchScope.value].searchGroups : []);

    useEffect(() => {
        if (!preselectedProgram.value) {
            dispatchShowInitialSearchPage();
        }
    },
    [
        preselectedProgram.value,
        dispatchShowInitialSearchPage,
    ]);

    // dan abramov suggest to stringify
    // https://twitter.com/dan_abramov/status/1104414469629898754?lang=en
    // so that useEffect can do the comparison efficiently
    const stringifyScopes = JSON.stringify(searchOptions);
    useEffect(() => {
        const dispatchAddFormIdToReduxStore = (formId) => { dispatch(addFormData(formId)); };

        // in order for the Form component to render
        // a formId under the `forms` reducer needs to be added.
        selectedSearchScope.value &&
          JSON.parse(stringifyScopes)[selectedSearchScope.value].searchGroups
              .forEach(({ formId }) => {
                  dispatchAddFormIdToReduxStore(formId);
              });
    },
    [
        dispatch,
        stringifyScopes,
        selectedSearchScope.value,
    ]);

    const handleProgramSelection = (searchScope) => {
        dispatchShowInitialSearchPage();
        setSelectedSearchScope(searchScope);
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
                    onSelect={handleProgramSelection}
                    selectedProgram={selectedSearchScope}
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
                                    onClick={showInitialSearchPage}
                                    primary
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

export const SearchPage = ({ ...props }: Props) => {
    const Composed = compose(
        withLoadingIndicator(),
        withErrorMessageHandler(),
        withStyles(getStyles),
    )(Index);

    const error: boolean = useSelector(({ activePage }) => activePage.selectionsError && activePage.selectionsError.error, isEqual);
    const ready: boolean = useSelector(({ activePage }) => !activePage.isLoading, isEqual);

    return <Composed {...props} error={error} ready={ready} />;
};
