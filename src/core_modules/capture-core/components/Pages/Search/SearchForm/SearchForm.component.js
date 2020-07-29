// @flow
import React, { useEffect, useMemo, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui-core';
import Form from '../../../D2Form/D2Form.component';
import { searchScopes } from '../SearchPage.component';
import { Section, SectionHeaderSimple } from '../../../Section';
import type { Props } from './SearchForm.types';
import { searchPageStatus } from '../../../../reducers/descriptions/searchPage.reducerDescription';

const getStyles = (theme: Theme) => ({
    searchDomainSelectorSection: {
        maxWidth: theme.typography.pxToRem(900),
        marginBottom: theme.typography.pxToRem(20),
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

const Index = ({
    searchViaUniqueIdOnScopeTrackedEntityType,
    searchViaUniqueIdOnScopeProgram,
    searchViaAttributesOnScopeProgram,
    searchViaAttributesOnScopeTrackedEntityType,
    saveCurrentFormData,
    selectedSearchScopeId,
    classes,
    searchGroupForSelectedScope,
    forms,
    searchStatus,
    isSearchViaAttributesValid,
    currentSearchTerms,
}: Props) => {
    const [error, setError] = useState(false);
    const [expandedFormId, setExpandedFormId] = useState(null);

    // each time the user selects new search scope we want the expanded form id to be initialised
    useEffect(() => {
        setExpandedFormId(null);
    },
    [selectedSearchScopeId],
    );

    useEffect(() => {
        searchGroupForSelectedScope
            .forEach(({ formId }, index) => {
                if (!expandedFormId && index === 0) {
                    setExpandedFormId(formId);
                }
            });
    }, [searchGroupForSelectedScope, expandedFormId]);

    return useMemo(() => {
        const formReference = {};

        const handleSearchViaUniqueId = (searchScopeType, searchScopeId, formId) => {
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
        };

        const handleSearchViaAttributes = (searchScopeType, searchScopeId, formId, minAttributesRequiredToSearch) => {
            const isValid = isSearchViaAttributesValid(minAttributesRequiredToSearch, formId);

            if (isValid) {
                setError(false);
                saveCurrentFormData(searchScopeType, searchScopeId, formId, currentSearchTerms);
                switch (searchScopeType) {
                case searchScopes.PROGRAM:
                    searchViaAttributesOnScopeProgram({ programId: searchScopeId, formId });
                    break;
                case searchScopes.TRACKED_ENTITY_TYPE:
                    searchViaAttributesOnScopeTrackedEntityType({ trackedEntityTypeId: searchScopeId, formId });
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
                    i18n.t(
                        'Fill in at least {{minAttributesRequiredToSearch}}  attributes to search',
                        { minAttributesRequiredToSearch },
                    )
                }
            </div>);
        return (<>
            {
                searchGroupForSelectedScope
                    .filter(searchGroup => searchGroup.unique)
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
                                            containerStyle={{ paddingLeft: 8, borderBottom: '1px solid #ECEFF1' }}
                                            title={i18n.t('Search {{name}}', { name })}
                                            onChangeCollapseState={() => { setExpandedFormId(formId); }}
                                            isCollapseButtonEnabled={isSearchSectionCollapsed}
                                            isCollapsed={isSearchSectionCollapsed}
                                        />
                                    }
                                >
                                    <div className={classes.searchRow}>
                                        <div className={classes.searchRowSelectElement}>
                                            {
                                                forms[formId] &&
                                                <Form
                                                    formRef={
                                                        (formInstance) => { formReference[formId] = formInstance; }
                                                    }
                                                    formFoundation={searchForm}
                                                    id={formId}
                                                />
                                            }
                                        </div>
                                    </div>
                                    <div className={classes.searchButtonContainer}>
                                        <Button
                                            disabled={searchStatus === searchPageStatus.LOADING}
                                            onClick={() =>
                                                selectedSearchScopeId &&
                                            handleSearchViaUniqueId(
                                                searchScope,
                                                selectedSearchScopeId,
                                                formId,
                                            )}
                                        >
                                            {i18n.t('Find by {{name}}', { name })}
                                        </Button>
                                    </div>
                                </Section>
                            </div>
                        );
                    })
            }

            {
                searchGroupForSelectedScope
                    .filter(searchGroup => !searchGroup.unique)
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
                                            containerStyle={{ paddingLeft: 8, borderBottom: '1px solid #ECEFF1' }}
                                            title={searchByText}
                                            onChangeCollapseState={() => { setExpandedFormId(formId); }}
                                            isCollapseButtonEnabled={isSearchSectionCollapsed}
                                            isCollapsed={isSearchSectionCollapsed}
                                        />
                                    }
                                >
                                    <div className={classes.searchRow}>
                                        <div className={classes.searchRowSelectElement}>
                                            {
                                                forms[formId] &&
                                                <Form
                                                    formFoundation={searchForm}
                                                    id={formId}
                                                />
                                            }
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
                    })
            }
        </>);
    },
    [
        classes.searchButtonContainer,
        classes.searchDomainSelectorSection,
        classes.searchRowSelectElement,
        classes.searchRow,
        classes.textInfo,
        classes.textError,
        forms,
        searchGroupForSelectedScope,
        selectedSearchScopeId,
        searchStatus,
        searchViaUniqueIdOnScopeTrackedEntityType,
        searchViaUniqueIdOnScopeProgram,
        searchViaAttributesOnScopeProgram,
        searchViaAttributesOnScopeTrackedEntityType,
        isSearchViaAttributesValid,
        saveCurrentFormData,
        currentSearchTerms,
        error,
        expandedFormId,
    ]);
};


export const SearchFormComponent = withStyles(getStyles)(Index);
