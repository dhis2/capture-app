// @flow
import React, { useMemo, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui-core';
import Form from '../../../D2Form/D2Form.component';
import { searchScopes } from '../SearchPage.container';
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
    onSearchViaUniqueIdOnScopeTrackedEntityType,
    onSearchViaUniqueIdOnScopeProgram,
    onSearchViaAttributesOnScopeProgram,
    onSearchViaAttributesOnScopeTrackedEntityType,
    selectedOptionId,
    classes,
    availableSearchOptions,
    forms,
    searchStatus,
    isSearchViaAttributesValid,
}: Props) => {
    const [error, setError] = useState(false);

    return useMemo(() => {
        const formReference = {};

        const handleSearchViaUniqueId = (selectedId, formId, searchScope) => {
            const isValid = formReference[formId].validateFormScrollToFirstFailedField({});

            if (isValid) {
                switch (searchScope) {
                case searchScopes.PROGRAM:
                    onSearchViaUniqueIdOnScopeProgram({ programId: selectedId, formId });
                    break;
                case searchScopes.TRACKED_ENTITY_TYPE:
                    onSearchViaUniqueIdOnScopeTrackedEntityType({ trackedEntityTypeId: selectedId, formId });
                    break;
                default:
                    break;
                }
            }
        };

        const isSearchViaAttributesFormValid = (formId, minAttributesRequiredToSearch) => {
            const isFormValid = formReference[formId].validateFormScrollToFirstFailedField({});
            const isLengthValid = isSearchViaAttributesValid(minAttributesRequiredToSearch, formId);
            return isFormValid && isLengthValid;
        };
        const handleSearchViaAttributes = (selectedId, formId, searchScope, minAttributesRequiredToSearch) => {
            const isValid = isSearchViaAttributesFormValid(formId, minAttributesRequiredToSearch);

            if (isValid) {
                setError(false);
                switch (searchScope) {
                case searchScopes.PROGRAM:
                    onSearchViaAttributesOnScopeProgram({ programId: selectedId, formId });
                    break;
                case searchScopes.TRACKED_ENTITY_TYPE:
                    onSearchViaAttributesOnScopeTrackedEntityType({ trackedEntityTypeId: selectedId, formId });
                    break;
                default:
                    break;
                }
            } else {
                setError(true);
            }
        };

        return (<>
            {
                selectedOptionId && availableSearchOptions[selectedOptionId].searchGroups
                    .filter(searchGroup => searchGroup.unique)
                    .map(({ searchForm, formId, searchScope }) => {
                        const name = searchForm.getElements()[0].formName;
                        return (
                            <Section
                                className={classes.searchDomainSelectorSection}
                                header={
                                    <SectionHeaderSimple
                                        containerStyle={{ paddingLeft: 8, borderBottom: '1px solid #ECEFF1' }}
                                        title={i18n.t('Search {{name}}', { name })}
                                    />
                                }
                            >
                                <div className={classes.searchRow}>
                                    <div className={classes.searchRowSelectElement}>
                                        {
                                            forms[formId] &&
                                            <Form
                                                formRef={(formInstance) => { formReference[formId] = formInstance; }}
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
                                            selectedOptionId &&
                                            handleSearchViaUniqueId(
                                                selectedOptionId,
                                                formId,
                                                searchScope,
                                            )}
                                    >
                                        Find by {name}
                                    </Button>
                                </div>
                            </Section>
                        );
                    })
            }

            {
                selectedOptionId && availableSearchOptions[selectedOptionId].searchGroups
                    .filter(searchGroup => !searchGroup.unique)
                    .map(({ searchForm, formId, searchScope, minAttributesRequiredToSearch }) => {
                        const searchByText = i18n.t('Search by attributes');
                        return (
                            <Section
                                className={classes.searchDomainSelectorSection}
                                header={
                                    <SectionHeaderSimple
                                        containerStyle={{ paddingLeft: 8, borderBottom: '1px solid #ECEFF1' }}
                                        title={searchByText}
                                    />
                                }
                            >
                                <div className={classes.searchRow}>
                                    <div className={classes.searchRowSelectElement}>
                                        {
                                            forms[formId] &&
                                            <Form
                                                formRef={(formInstance) => { formReference[formId] = formInstance; }}
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
                                            selectedOptionId &&
                                            handleSearchViaAttributes(
                                                selectedOptionId,
                                                formId,
                                                searchScope,
                                                minAttributesRequiredToSearch,
                                            )
                                        }
                                    >
                                        {searchByText}
                                    </Button>
                                    <div className={error ? classes.textError : classes.textInfo}>
                                        Fill in at least {minAttributesRequiredToSearch}  attributes to search
                                    </div>
                                </div>
                            </Section>
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
        availableSearchOptions,
        selectedOptionId,
        onSearchViaUniqueIdOnScopeTrackedEntityType,
        onSearchViaUniqueIdOnScopeProgram,
        onSearchViaAttributesOnScopeProgram,
        onSearchViaAttributesOnScopeTrackedEntityType,
        searchStatus,
        isSearchViaAttributesValid,
        error,
    ]);
};

export const SearchFormComponent = withStyles(getStyles)(Index);
