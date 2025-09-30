import React, { type ComponentType, useContext, useEffect, useMemo, useState } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers, colors } from '@dhis2/ui';
import { D2Form } from '../../D2Form';
import { searchScopes } from '../SearchBox.constants';
import { Section, SectionHeaderSimple } from '../../Section';
import { UnsupportedAttributesNotification } from '../../../utils/warnings';
import type { Props } from './SearchForm.types';
import { searchBoxStatus } from '../../../reducers/descriptions/searchDomain.reducerDescription';
import { ResultsPageSizeContext } from '../../Pages/shared-contexts';

const styles: Readonly<any> = {
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
};

const useFormDataLifecycle = (
    searchGroupsForSelectedScope,
    addFormIdToReduxStore,
    removeFormDataFromReduxStore,
    keptFallbackSearchFormValues,
) =>
    useEffect(() => {
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
        return () => removeFormDataFromReduxStore();
    },
    [
        keptFallbackSearchFormValues,
        searchGroupsForSelectedScope,
        addFormIdToReduxStore,
        removeFormDataFromReduxStore,
    ]);

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
    filteredUnsupportedAttributes,
    classes,
    formsValues,
    searchStatus,
    isSearchViaAttributesValid,
    isSearchViaUniqueIdValid,
    showUniqueSearchValueEmptyModal,
    keptFallbackSearchFormValues,
}: Props & WithStyles<typeof styles>) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext) as any;

    useFormDataLifecycle(searchGroupsForSelectedScope, addFormIdToReduxStore, removeFormDataFromReduxStore, keptFallbackSearchFormValues);

    const [error, setError] = useState(false);
    const [expandedFormId, setExpandedFormId] = useState<string | null>(null);

    useEffect(() => {
        setExpandedFormId(null);
    },
    [selectedSearchScopeId],
    );

    useEffect(() => {
        expandTheFirstForm(searchGroupsForSelectedScope, expandedFormId, setExpandedFormId);
    }, [
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

        const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' && expandedFormId && selectedSearchScopeId) {
                const buttonRef = (containerButtonRef[expandedFormId] as any).children[0];
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
                                    <div>
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
                                    <div>
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
                                        <br />
                                        {filteredUnsupportedAttributes && filteredUnsupportedAttributes.length > 0 && (
                                            <UnsupportedAttributesNotification
                                                filteredUnsupportedAttributes={filteredUnsupportedAttributes}
                                            />
                                        )}
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
        filteredUnsupportedAttributes,
    ]);
};

export const SearchFormComponent = withStyles(styles)(SearchFormIndex) as ComponentType<Props>;
