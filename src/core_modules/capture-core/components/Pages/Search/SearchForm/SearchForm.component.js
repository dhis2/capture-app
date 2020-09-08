// @flow
import React, { useMemo } from 'react';
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
});

const Index = ({
    onSearchViaUniqueIdOnScopeTrackedEntityType,
    onSearchViaUniqueIdOnScopeProgram,
    selectedOptionId,
    classes,
    availableSearchOptions,
    forms,
    searchStatus,
}: Props) =>
    (useMemo(() => {
        const formReference = {};

        const handleOnFindUsingUniqueIdentifier = (selectedId, formId, searchScope) => {
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

        return selectedOptionId ?
            availableSearchOptions[selectedOptionId].searchGroups
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
                                        selectedOptionId &&
                                    handleOnFindUsingUniqueIdentifier(selectedOptionId, formId, searchScope)}
                                >
                                    Find by {name}.
                                </Button>
                            </div>
                        </Section>
                    );
                })
            : <div />;
    },
    [
        classes.searchButtonContainer,
        classes.searchDomainSelectorSection,
        classes.searchRowSelectElement,
        classes.searchRow,
        forms,
        availableSearchOptions,
        selectedOptionId,
        onSearchViaUniqueIdOnScopeTrackedEntityType,
        onSearchViaUniqueIdOnScopeProgram,
        searchStatus,
    ]));


export const SearchFormComponent = withStyles(getStyles)(Index);
