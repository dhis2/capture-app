// @flow
import React, { type ComponentType, useContext, useEffect, useMemo, useState } from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers, colors } from '@dhis2/ui';
import { D2Form } from '../../D2Form';
import { searchScopes } from '../SearchBox.constants';
import { Section, SectionHeaderSimple } from '../../Section';
import type { Props } from './SearchForm.types';
import { searchBoxStatus } from '../../../reducers/descriptions/searchDomain.reducerDescription';
import { ResultsPageSizeContext } from '../../Pages/shared-contexts';

const getStyles = () => ({
    searchDomainsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp16,
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
        padding: spacers.dp8,
        display: 'flex',
        alignItems: 'center',
    },
    textInfo: {
        textAlign: 'right',
        fontSize: '14px',
        flexGrow: 1,
        color: colors.grey700,
    },
    textError: {
        textAlign: 'right',
        fontSize: '14px',
        fontWeight: 500,
        flexGrow: 1,
        color: colors.red600,
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
        searchGroupsForSelectedScope
            .forEach(({ formId, searchForm }) => {
                const elements = searchForm.getElements();
                const formValuesThatExistInTETypeSearchScope =
                  ([...elements.values()].reduce((acc, { id: fieldId }) => {
                      if (Object.keys(keptFallbackSearchFormValues).includes(fieldId)) {
                          const fieldValue = keptFallbackSearchFormValues[fieldId];
                          return { ...acc, [fieldId]: fieldValue };
                      }
                      return acc;
                  }, {}));
                addFormIdToReduxStore(formId, formValuesThatExistInTETypeSearchScope);
            });
        // we remove the data on unmount to clean the store
        return () => removeFormDataFromReduxStore();
    },
    [
        keptFallbackSearchFormValues,
        searchGroupsForSelectedScope,
        addFormIdToReduxStore,
        removeFormDataFromReduxStore,
    ]);


const expandTheAttributesForm = (searchGroupsForSelectedScope, expandedFormId, setExpandedFormId) => {
    searchGroupsForSelectedScope
        .filter(searchGroup => !searchGroup.unique)
        .forEach(({ formId }, index) => {
            if (!expandedFormId && index === 0) {
                setExpandedFormId(formId);
            }
        });
};

const expandTheFirstForm = (searchGroupsForSelectedScope, expandedFormId, setExpandedFormId) => {
    searchGroupsForSelectedScope
        .forEach(({ formId }, index) => {
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
    isSearchViaUniqueIdValid,
    showUniqueSearchValueEmptyModal,
    keptFallbackSearchFormValues,
    fallbackTriggered,
}: Props) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);

    useFormDataLifecycle(searchGroupsForSelectedScope, addFormIdToReduxStore, removeFormDataFromReduxStore, keptFallbackSearchFormValues);

    const [error, setError] = useState(false);
    const [expandedFormId, setExpandedFormId] = useState(null);

    // each time the user selects new search scope we want the expanded form id to be initialised
    useEffect(() => {
        setExpandedFormId(null);
    },
    [selectedSearchScopeId],
    );

    useEffect(() => {
        if (fallbackTriggered) {
            expandTheAttributesForm(searchGroupsForSelectedScope, expandedFormId, setExpandedFormId);
        } else {
            expandTheFirstForm(searchGroupsForSelectedScope, expandedFormId, setExpandedFormId);
        }
    }, [
        fallbackTriggered,
        searchGroupsForSelectedScope,
        expandedFormId,
    ]);

    return useMemo(() => {
        const formReference = {};
        const containerButtonRef = {};

        const handleSearchViaUniqueId = (searchScopeType, searchScopeId, formId, uniqueTEAName) => {
            const isSearchUniqueIdValid = isSearchViaUniqueIdValid(formId);
            if (isSearchUniqueIdValid) {
                const isValid = formReference[formId].validateFormScrollToFirstFailedField({});
                if (isValid) {
                    switch (searchScopeType) {
                    case searchScopes.PROGRAM:
                        searchViaUniqueIdOnScopeProgram({ programId: searchScopeId, formId });
                        break;
                    case searchScopes.TRACKED_ENTITY_TYPE:
                        searchViaUniqueIdOnScopeTrackedEntityType({ trackedEntityTypeId: searchScopeId, formId });
                        break;
                    default:
                        break;
                    }
                }
            } else {
                showUniqueSearchValueEmptyModal({ uniqueTEAName });
            }
        };

        const handleSearchViaAttributes = (searchScopeType, searchScopeId, formId, minAttributesRequiredToSearch) => {
            const isValid = isSearchViaAttributesValid(minAttributesRequiredToSearch, formId);

            if (isValid) {
                setError(false);
                saveCurrentFormData({ searchScopeType, searchScopeId, formId, formsValues, searchGroupsForSelectedScope });
                switch (searchScopeType) {
                case searchScopes.PROGRAM:
                    searchViaAttributesOnScopeProgram({ programId: searchScopeId, formId, resultsPageSize });
                    break;
                case searchScopes.TRACKED_ENTITY_TYPE:
                    searchViaAttributesOnScopeTrackedEntityType({ trackedEntityTypeId: searchScopeId, formId, resultsPageSize });
                    break;
                default:
                    break;
                }
            } else {
                setError(true);
            }
        };

        const FormInformativeMessage = ({ minAttributesRequiredToSearch }) =>
            (<div className={error ? classes.textError : classes.textInfo}>
                {
                    i18n.t('Fill in at least {{count}} attribute to search', {
                        count: minAttributesRequiredToSearch,
                        defaultValue: 'Fill in at least {{count}} attribute to search',
                        defaultValue_plural: 'Fill in at least {{count}} attributes to search',
                    })
                }
            </div>);

        const handleKeyPress = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' && expandedFormId && selectedSearchScopeId) {
                const buttonRef = containerButtonRef[expandedFormId].children[0];
                buttonRef.focus();
                setTimeout(() => { buttonRef.click(); });
            }
        };

        return (<div
            tabIndex={-1}
            onKeyPress={handleKeyPress}
            role={'none'}
            className={classes.searchDomainsContainer}
        >
            {
                searchGroupsForSelectedScope
                    .filter(searchGroup => searchGroup.unique)
                    .map(({ searchForm, formId, searchScope }) => {
                        const isSearchSectionCollapsed = !(expandedFormId === formId);
                        const name = searchForm.getElements()[0].formName;

                        return (
                            <div key={formId} data-test="form-unique">
                                <Section
                                    isCollapsed={isSearchSectionCollapsed}
                                    header={
                                        <SectionHeaderSimple
                                            containerStyle={{ alignItems: 'center' }}
                                            title={i18n.t('Search {{name}}', {
                                                name, interpolation: { escapeValue: false },
                                            })}
                                            titleStyle={{ background: 'transparent', paddingTop: 8, fontSize: 16 }}
                                            onChangeCollapseState={() => { setExpandedFormId(formId); }}
                                            isCollapseButtonEnabled={isSearchSectionCollapsed}
                                            isCollapsed={isSearchSectionCollapsed}
                                            extendedCollapsibility
                                        />
                                    }
                                >
                                    <div className={classes.searchRow}>
                                        <div className={classes.searchRowSelectElement}>
                                            <D2Form
                                                formRef={
                                                    (formInstance) => { formReference[formId] = formInstance; }
                                                }
                                                formFoundation={searchForm}
                                                id={formId}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className={classes.searchButtonContainer}
                                        ref={(ref) => { containerButtonRef[formId] = ref; }}
                                    >
                                        <Button
                                            disabled={searchStatus === searchBoxStatus.LOADING}
                                            onClick={() =>
                                                selectedSearchScopeId &&
                                            handleSearchViaUniqueId(
                                                searchScope,
                                                selectedSearchScopeId,
                                                formId,
                                                name,
                                            )}
                                        >
                                            {i18n.t('Search by {{name}}', {
                                                name, interpolation: { escapeValue: false },
                                            })}
                                        </Button>
                                    </div>
                                </Section>
                            </div>
                        );
                    })
            }

            {
                searchGroupsForSelectedScope
                    .filter(searchGroup => !searchGroup.unique)
                    .map(({ searchForm, formId, searchScope, minAttributesRequiredToSearch }) => {
                        const searchByText = i18n.t('Search by attributes');
                        const isSearchSectionCollapsed = !(expandedFormId === formId);
                        return (
                            <div key={formId} data-test="form-attributes">
                                <Section
                                    isCollapsed={isSearchSectionCollapsed}
                                    header={
                                        <SectionHeaderSimple
                                            containerStyle={{ alignItems: 'center' }}
                                            titleStyle={{ background: 'transparent', paddingTop: 8, fontSize: 16 }}
                                            title={searchByText}
                                            onChangeCollapseState={() => { setExpandedFormId(formId); }}
                                            isCollapseButtonEnabled={isSearchSectionCollapsed}
                                            isCollapsed={isSearchSectionCollapsed}
                                            extendedCollapsibility
                                        />
                                    }
                                >
                                    <div className={classes.searchRow}>
                                        <div className={classes.searchRowSelectElement}>
                                            <D2Form
                                                formRef={(formInstance) => { formReference[formId] = formInstance; }}
                                                formFoundation={searchForm}
                                                id={formId}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className={classes.searchButtonContainer}
                                        ref={(ref) => { containerButtonRef[formId] = ref; }}
                                    >
                                        <Button
                                            disabled={searchStatus === searchBoxStatus.LOADING}
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
                    })
            }
        </div>);
    },
    [
        classes.searchButtonContainer,
        classes.searchDomainsContainer,
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
        isSearchViaUniqueIdValid,
        showUniqueSearchValueEmptyModal,
        saveCurrentFormData,
        formsValues,
        resultsPageSize,
        error,
        expandedFormId,
    ]);
};

export const SearchFormComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(SearchFormIndex);
