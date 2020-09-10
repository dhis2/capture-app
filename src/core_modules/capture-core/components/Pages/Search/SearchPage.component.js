// @flow
import React, { useMemo, useState, useEffect } from 'react';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
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
import type { Props } from './SearchPage.types';
import { Section, SectionHeaderSimple } from '../../Section';
import { searchPageStatus } from '../../../reducers/descriptions/searchPage.reducerDescription';
import { SearchForm } from './SearchForm';

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
});

const SearchSelection =
  withStyles(getStyles)(({ trackedEntityTypesWithCorrelatedPrograms, classes, setSelected, selectedOption }) =>
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
                      onChange={({ selected }) => { setSelected(selected); }}
                      selected={selectedOption}
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


const Index = ({
    classes,
    trackedEntityTypesWithCorrelatedPrograms,
    preselectedProgram,
    availableSearchOptions,
    searchStatus,
    addFormIdToReduxStore,
    closeModal,
    navigateToMainPage,
    searchResults,
    generalPurposeErrorMessage,
}: Props) => {
    const [selectedOption, setSelected] = useState(preselectedProgram);


    // dan abramov suggest to stringify https://twitter.com/dan_abramov/status/1104414469629898754?lang=en
    // so that useEffect can do the comparison
    const stringifyPrograms = JSON.stringify(availableSearchOptions);
    useEffect(() => {
        // in order for the Form component to render
        // need to add a formId under the `forms` reducer
        selectedOption.value &&
        JSON.parse(stringifyPrograms)[selectedOption.value].searchGroups
            .forEach(({ formId }) => {
                addFormIdToReduxStore(formId);
            });
    },
    [
        stringifyPrograms,
        selectedOption.value,
        addFormIdToReduxStore,
    ]);


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
                    setSelected={setSelected}
                    selectedOption={selectedOption}
                />

                <SearchForm
                    selectedSearchScopeId={selectedOption.value}
                    availableSearchOptions={availableSearchOptions}
                />

                {
                    searchStatus === searchPageStatus.NO_RESULTS &&
                    <Modal position="middle">
                        <ModalTitle>Empty results</ModalTitle>
                        <ModalContent>There was no item found</ModalContent>
                        <ModalActions>
                            <ButtonStrip end>
                                <Button
                                    disabled={searchStatus === searchPageStatus.LOADING}
                                    onClick={closeModal}
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
                    searchStatus === searchPageStatus.SHOW_RESULTS &&
                    <h3>
                        Your search has given results. At this point the results are stored.
                        Number of results: {searchResults && searchResults.length}
                    </h3>

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
                !selectedOption.value &&
                    <Paper elevation={0} data-test="dhis2-capture-informative-paper">
                        <div className={classes.emptySelectionPaperContent}>
                            {i18n.t('Make a selection to start searching')}
                        </div>
                    </Paper>
            }
        </div>
    </>);
};

export const SearchPage = withStyles(getStyles)(Index);
