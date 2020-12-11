// @flow
import React, { type ComponentType, useContext, useEffect, useMemo, useState } from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { D2Form } from '../../../D2Form';
import { searchScopes } from '../SearchPage.constants';
import { Section, SectionHeaderSimple } from '../../../Section';
import type { Props } from './SearchForm.types';
import { searchPageStatus } from '../../../../reducers/descriptions/searchPage.reducerDescription';
import { ResultsPageSizeContext } from '../../shared-contexts';

const getStyles = (theme: Theme) => ({
  searchDomainSelectorSection: {
    margin: '16px 8px 8px 8px',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRowSelectElement: {
    width: '100%',
  },
  searchButtonContainer: {
    padding: theme.typography.pxToRem(10),
    display: 'flex',
    alignItems: 'center',
  },
  textInfo: {
    textAlign: 'right',
    fontSize: '14px',
    flexGrow: 1,
  },
  textError: {
    textAlign: 'right',
    fontSize: theme.typography.pxToRem(14),
    flexGrow: 1,
    color: theme.palette.error.main,
  },
});

const useFormDataLifecycle = (
  searchGroupsForSelectedScope,
  addFormIdToReduxStore,
  removeFormDataFromReduxStore,
  keptFallbackSearchFormValues,
) =>
  useEffect(() => {
    // in order for the Form component to render
    // a formId under the `forms` reducer needs to be added.
    searchGroupsForSelectedScope.forEach(({ formId, searchForm }) => {
      const elements = searchForm.getElements();
      const formValuesThatExistInTETypeSearchScope = [...elements.values()].reduce(
        (acc, { id: fieldId }) => {
          if (Object.keys(keptFallbackSearchFormValues).includes(fieldId)) {
            const fieldValue = keptFallbackSearchFormValues[fieldId];
            return { ...acc, [fieldId]: fieldValue };
          }
          return acc;
        },
        {},
      );
      addFormIdToReduxStore(formId, formValuesThatExistInTETypeSearchScope);
    });
    // we remove the data on unmount to clean the store
    return () => removeFormDataFromReduxStore();
  }, [
    keptFallbackSearchFormValues,
    searchGroupsForSelectedScope,
    addFormIdToReduxStore,
    removeFormDataFromReduxStore,
  ]);

const expandTheAttributesForm = (
  searchGroupsForSelectedScope,
  expandedFormId,
  setExpandedFormId,
) => {
  searchGroupsForSelectedScope
    .filter((searchGroup) => !searchGroup.unique)
    .forEach(({ formId }, index) => {
      if (!expandedFormId && index === 0) {
        setExpandedFormId(formId);
      }
    });
};

const expandTheFirstForm = (searchGroupsForSelectedScope, expandedFormId, setExpandedFormId) => {
  searchGroupsForSelectedScope.forEach(({ formId }, index) => {
    if (!expandedFormId && index === 0) {
      setExpandedFormId(formId);
    }
  });
};

const SearchFormIndex = ({
  searchViaUniqueIdOnScopeTrackedEntityType,
  searchViaUniqueIdOnScopeProgram,
  searchViaAttributesOnScopeProgram,
  searchViaAttributesOnScopeTrackedEntityType,
  saveCurrentFormData,
  addFormIdToReduxStore,
  removeFormDataFromReduxStore,
  selectedSearchScopeId,
  searchGroupsForSelectedScope,
  classes,
  formsValues,
  searchStatus,
  isSearchViaAttributesValid,
  keptFallbackSearchFormValues,
  fallbackTriggered,
}: Props) => {
  const { resultsPageSize } = useContext(ResultsPageSizeContext);

  useFormDataLifecycle(
    searchGroupsForSelectedScope,
    addFormIdToReduxStore,
    removeFormDataFromReduxStore,
    keptFallbackSearchFormValues,
  );

  const [error, setError] = useState(false);
  const [expandedFormId, setExpandedFormId] = useState(null);

  // each time the user selects new search scope we want the expanded form id to be initialised
  useEffect(() => {
    setExpandedFormId(null);
  }, [selectedSearchScopeId]);

  useEffect(() => {
    if (fallbackTriggered) {
      expandTheAttributesForm(searchGroupsForSelectedScope, expandedFormId, setExpandedFormId);
    } else {
      expandTheFirstForm(searchGroupsForSelectedScope, expandedFormId, setExpandedFormId);
    }
  }, [fallbackTriggered, searchGroupsForSelectedScope, expandedFormId]);

  return useMemo(() => {
    const formReference = {};

    const handleSearchViaUniqueId = (searchScopeType, searchScopeId, formId) => {
      const isValid = formReference[formId].validateFormScrollToFirstFailedField({});

      if (isValid) {
        switch (searchScopeType) {
          case searchScopes.PROGRAM:
            searchViaUniqueIdOnScopeProgram({
              programId: searchScopeId,
              formId,
            });
            break;
          case searchScopes.TRACKED_ENTITY_TYPE:
            searchViaUniqueIdOnScopeTrackedEntityType({
              trackedEntityTypeId: searchScopeId,
              formId,
            });
            break;
          default:
            break;
        }
      }
    };

    const handleSearchViaAttributes = (
      searchScopeType,
      searchScopeId,
      formId,
      minAttributesRequiredToSearch,
    ) => {
      const isValid = isSearchViaAttributesValid(minAttributesRequiredToSearch, formId);

      if (isValid) {
        setError(false);
        saveCurrentFormData({
          searchScopeType,
          searchScopeId,
          formId,
          formsValues,
          searchGroupsForSelectedScope,
        });
        switch (searchScopeType) {
          case searchScopes.PROGRAM:
            searchViaAttributesOnScopeProgram({
              programId: searchScopeId,
              formId,
              resultsPageSize,
            });
            break;
          case searchScopes.TRACKED_ENTITY_TYPE:
            searchViaAttributesOnScopeTrackedEntityType({
              trackedEntityTypeId: searchScopeId,
              formId,
              resultsPageSize,
            });
            break;
          default:
            break;
        }
      } else {
        setError(true);
      }
    };

    const FormInformativeMessage = ({ minAttributesRequiredToSearch }) => (
      <div className={error ? classes.textError : classes.textInfo}>
        {i18n.t('Fill in at least {{minAttributesRequiredToSearch}}  attributes to search', {
          minAttributesRequiredToSearch,
        })}
      </div>
    );
    return (
      <>
        {searchGroupsForSelectedScope
          .filter((searchGroup) => searchGroup.unique)
          .map(({ searchForm, formId, searchScope }) => {
            const isSearchSectionCollapsed = !(expandedFormId === formId);
            const name = searchForm.getElements()[0].formName;

            return (
              <div key={formId} data-test="dhis2-capture-form-unique">
                <Section
                  isCollapsed={isSearchSectionCollapsed}
                  className={classes.searchDomainSelectorSection}
                  header={
                    <SectionHeaderSimple
                      containerStyle={{
                        borderBottom: '1px solid #ECEFF1',
                      }}
                      title={i18n.t('Search {{name}}', {
                        name,
                      })}
                      onChangeCollapseState={() => {
                        setExpandedFormId(formId);
                      }}
                      isCollapseButtonEnabled={isSearchSectionCollapsed}
                      isCollapsed={isSearchSectionCollapsed}
                    />
                  }
                >
                  <div className={classes.searchRow}>
                    <div className={classes.searchRowSelectElement}>
                      <D2Form
                        formRef={(formInstance) => {
                          formReference[formId] = formInstance;
                        }}
                        formFoundation={searchForm}
                        id={formId}
                      />
                    </div>
                  </div>
                  <div className={classes.searchButtonContainer}>
                    <Button
                      disabled={searchStatus === searchPageStatus.LOADING}
                      onClick={() =>
                        selectedSearchScopeId &&
                        handleSearchViaUniqueId(searchScope, selectedSearchScopeId, formId)
                      }
                    >
                      {i18n.t('Find by {{name}}', {
                        name,
                      })}
                    </Button>
                  </div>
                </Section>
              </div>
            );
          })}

        {searchGroupsForSelectedScope
          .filter((searchGroup) => !searchGroup.unique)
          .map(({ searchForm, formId, searchScope, minAttributesRequiredToSearch }) => {
            const searchByText = i18n.t('Search by attributes');
            const isSearchSectionCollapsed = !(expandedFormId === formId);
            return (
              <div key={formId} data-test="dhis2-capture-form-attributes">
                <Section
                  isCollapsed={isSearchSectionCollapsed}
                  className={classes.searchDomainSelectorSection}
                  header={
                    <SectionHeaderSimple
                      containerStyle={{
                        borderBottom: '1px solid #ECEFF1',
                      }}
                      title={searchByText}
                      onChangeCollapseState={() => {
                        setExpandedFormId(formId);
                      }}
                      isCollapseButtonEnabled={isSearchSectionCollapsed}
                      isCollapsed={isSearchSectionCollapsed}
                    />
                  }
                >
                  <div className={classes.searchRow}>
                    <div className={classes.searchRowSelectElement}>
                      <D2Form
                        formRef={(formInstance) => {
                          formReference[formId] = formInstance;
                        }}
                        formFoundation={searchForm}
                        id={formId}
                      />
                    </div>
                  </div>
                  <div className={classes.searchButtonContainer}>
                    <Button
                      disabled={searchStatus === searchPageStatus.LOADING}
                      onClick={() =>
                        selectedSearchScopeId &&
                        handleSearchViaAttributes(
                          searchScope,
                          selectedSearchScopeId,
                          formId,
                          minAttributesRequiredToSearch,
                        )
                      }
                    >
                      {searchByText}
                    </Button>
                    <FormInformativeMessage
                      minAttributesRequiredToSearch={minAttributesRequiredToSearch}
                    />
                  </div>
                </Section>
              </div>
            );
          })}
      </>
    );
  }, [
    classes.searchButtonContainer,
    classes.searchDomainSelectorSection,
    classes.searchRowSelectElement,
    classes.searchRow,
    classes.textInfo,
    classes.textError,
    selectedSearchScopeId,
    searchStatus,
    searchViaUniqueIdOnScopeTrackedEntityType,
    searchViaUniqueIdOnScopeProgram,
    searchViaAttributesOnScopeProgram,
    searchViaAttributesOnScopeTrackedEntityType,
    searchGroupsForSelectedScope,
    isSearchViaAttributesValid,
    saveCurrentFormData,
    formsValues,
    resultsPageSize,
    error,
    expandedFormId,
  ]);
};

export const SearchFormComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(
  SearchFormIndex,
);
