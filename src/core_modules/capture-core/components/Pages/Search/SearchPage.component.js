// @flow
import React, { useMemo, useState, useEffect } from 'react';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { useSelector, shallowEqual } from 'react-redux';
import {
    SingleSelect,
    SingleSelectOption,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
} from '@dhis2/ui-core';
import { LockedSelector } from '../../LockedSelector';
import type { AvailableSearchOptions, PreselectedProgram, Props, TrackedEntityTypesWithCorrelatedPrograms } from './SearchPage.types';
import { Section, SectionHeaderSimple } from '../../Section';
import { searchPageStatus } from '../../../reducers/descriptions/searchPage.reducerDescription';
import { SearchForm } from './SearchForm';
import { LoadingMask } from '../../LoadingMasks';
import { SearchResults } from './SearchResults/SearchResults.container';
import { programCollection } from '../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../metaData/Program';
import { searchScopes } from './SearchPage.container';

const getStyles = (theme: Theme) => ({
    divider: {
        padding: '8px',
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
    emptySelectionPaperContainer: {
        padding: 24,
    },
    customEmpty: {
        textAlign: 'center',
        padding: '8px 24px',
    },
    searchDomainSelectorSection: {
        maxWidth: theme.typography.pxToRem(900),
        marginBottom: theme.typography.pxToRem(20),
    },
    searchRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchRowTitle: {
        flexBasis: 200,
        marginLeft: 8,
    },
    searchRowSelectElement: {
        width: '100%',
    },
    searchButtonContainer: {
        padding: theme.typography.pxToRem(10),
        display: 'flex',
        alignItems: 'center',
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
    pagination: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    topSection: {
        display: 'flex',
        flexDirection: 'column',
        margin: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
        backgroundColor: theme.palette.grey.lighter,
    },
});

const SearchSelection =
  withStyles(getStyles)(({ trackedEntityTypesWithCorrelatedPrograms, classes, onSelect, selectedProgram }) =>
      (<Section
          className={classes.searchDomainSelectorSection}
          header={
              <SectionHeaderSimple
                  containerStyle={{ paddingLeft: 8, borderBottom: '1px solid #ECEFF1' }}
                  title={i18n.t('Search')}
              />
          }
      >
          <div className={classes.searchRow} style={{ padding: '8px 0' }}>
              <div className={classes.searchRowTitle}>Search for</div>
              <div className={classes.searchRowSelectElement} style={{ marginRight: 8 }}>
                  <SingleSelect
                      onChange={({ selected }) => { onSelect(selected); }}
                      selected={selectedProgram}
                      empty={<div className={classes.customEmpty}>Custom empty component</div>}
                  >
                      {
                          useMemo(() => Object.values(trackedEntityTypesWithCorrelatedPrograms)
                          // $FlowFixMe https://github.com/facebook/flow/issues/2221
                              .map(({ trackedEntityTypeName, trackedEntityTypeId, programs: tePrograms }) =>
                              // SingleSelect component wont allow us to wrap the SingleSelectOption
                              // in any other element and still make use of the default behaviour.
                              // Therefore we are returning the group title and the
                              // SingleSelectOption in an array.
                                  [
                                      <SingleSelectOption
                                          value={trackedEntityTypeId}
                                          label={trackedEntityTypeName}
                                      />,
                                      tePrograms.map(({ programName, programId }) =>
                                          (<SingleSelectOption value={programId} label={programName} />)),
                                      <div className={classes.divider} key={trackedEntityTypeId}>
                                          <hr />
                                      </div>,
                                  ],
                              ),
                          [
                              classes.divider,
                              trackedEntityTypesWithCorrelatedPrograms,
                          ])
                      }
                  </SingleSelect>
              </div>
          </div>
      </Section>));

const buildSearchOption = (id, name, searchGroups, searchScope) => ({
    searchOptionId: id,
    searchOptionName: name,
    searchGroups: [...searchGroups.values()]
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


const Index = ({
    addFormIdToReduxStore,
    navigateToMainPage,
    showInitialSearchPage,
    classes,
}: Props) => {
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

    const flattenedSearchOptions: AvailableSearchOptions =
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
                  ...programs.reduce((acc2, { programId, programName, searchGroups }) => ({
                      ...acc2,
                      [programId]: buildSearchOption(programId, programName, searchGroups, searchScopes.PROGRAM),
                  }), {}),
              }), {}),
      [trackedEntityTypesWithCorrelatedPrograms],
      );


    const searchStatus: string = useSelector(({ searchPage }): string => searchPage.searchStatus);
    const generalPurposeErrorMessage: string = useSelector(({ searchPage }): string => searchPage.generalPurposeErrorMessage);
    const preselectedProgram: PreselectedProgram = useSelector(({ currentSelections }) => {
        const preselected = Object.values(trackedEntityTypesWithCorrelatedPrograms)
            // $FlowFixMe https://github.com/facebook/flow/issues/2221
            .map(({ programs }) => programs.find(({ programId }) => programId === currentSelections.programId))
            .filter(program => program)[0];
        return {
            value: preselected && preselected.programId,
            label: preselected && preselected.programName,
        };
    });

    const [selectedProgram, setSelectedProgram] = useState(preselectedProgram);

    const searchGroupForSelectedScope =
      (selectedProgram.value ? flattenedSearchOptions[selectedProgram.value].searchGroups : [])
          // We use the sorted array to always have expanded the first search group section.
          .sort(({ unique: xBoolean }, { unique: yBoolean }) => {
              if (xBoolean === yBoolean) {
                  return 0;
              }
              if (xBoolean) {
                  return -1;
              }
              return 1;
          });

    useEffect(() => {
        if (!preselectedProgram.value) {
            showInitialSearchPage();
        }
    },
    [
        preselectedProgram.value,
        showInitialSearchPage,
    ]);

    // dan abramov suggest to stringify https://twitter.com/dan_abramov/status/1104414469629898754?lang=en
    // so that useEffect can do the comparison
    const stringifyPrograms = JSON.stringify(flattenedSearchOptions);
    useEffect(() => {
        // in order for the Form component to render
        // a formId under the `forms` reducer needs to be added.
        selectedProgram.value &&
        JSON.parse(stringifyPrograms)[selectedProgram.value].searchGroups
            .forEach(({ formId }) => {
                addFormIdToReduxStore(formId);
            });
    },
    [
        stringifyPrograms,
        selectedProgram.value,
        addFormIdToReduxStore,
    ]);

    const handleProgramSelection = (program) => {
        showInitialSearchPage();
        setSelectedProgram(program);
    };

    return (<>
        <LockedSelector />
        <div data-test="dhis2-capture-search-page-content" className={classes.container}>
            <Button dataTest="dhis2-capture-back-button" className={classes.backButton} onClick={navigateToMainPage}>
                <ChevronLeft />
                {i18n.t('Back')}
            </Button>

            <Paper className={classes.paper}>

                <SearchSelection
                    trackedEntityTypesWithCorrelatedPrograms={trackedEntityTypesWithCorrelatedPrograms}
                    onSelect={handleProgramSelection}
                    selectedProgram={selectedProgram}
                />

                <SearchForm
                    selectedSearchScopeId={selectedProgram.value}
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
                searchStatus === searchPageStatus.INITIAL && !selectedProgram.value &&
                    <Paper elevation={0} data-test={'dhis2-capture-informative-paper'}>
                        <div className={classes.emptySelectionPaperContent}>
                            {i18n.t('Make a selection to start searching')}
                        </div>
                    </Paper>
            }
        </div>
    </>);
};

export const SearchPage = withStyles(getStyles)(Index);
