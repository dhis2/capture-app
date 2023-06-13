// @flow
import { connect } from 'react-redux';
import type { ComponentType } from 'react';
import { isObject, isString } from 'd2-utilizr/src';
import { SearchFormComponent } from './SearchForm.component';
import type { CurrentSearchTerms, DispatchersFromRedux, OwnProps, Props, PropsFromRedux } from './SearchForm.types';
import {
    saveCurrentSearchInfo,
    searchViaAttributesOnScopeProgram,
    searchViaAttributesOnScopeTrackedEntityType,
    searchViaUniqueIdOnScopeProgram,
    searchViaUniqueIdOnScopeTrackedEntityType,
    showUniqueSearchValueEmptyModal,
} from '../SearchBox.actions';
import { addFormData, removeFormData } from '../../D2Form/actions/form.actions';

const isValueContainingCharacter = (value: any) => {
    if (!value) {
        return false;
    }
    if (isString(value)) {
        return Boolean(value.replace(/\s/g, '').length);
    }

    if (isObject(value)) {
        const numberOfValuesWithLength = Object.values(value)
            .filter(v => isString(v))
            .filter((v: any) => Boolean(v.replace(/\s/g, '').length))
            .length;

        return Boolean(numberOfValuesWithLength === Object.keys(value).length);
    }
    return true;
};

const collectCurrentSearchTerms = (searchGroupsForSelectedScope, formsValues): CurrentSearchTerms => {
    const { searchForm: attributeSearchForm, formId } = searchGroupsForSelectedScope
        .reduce((accumulated, searchGroup) => {
            if (!searchGroup.unique) {
                return { accumulated, ...searchGroup };
            }
            return accumulated;
        }, {});

    const searchTerms = formsValues[formId] || {};
    return Object.keys(searchTerms)
        .reduce((accumulated, attributeValueKey) => {
            const { name, id, type } = attributeSearchForm.getElement(attributeValueKey);
            const value = searchTerms[attributeValueKey];
            if (isValueContainingCharacter(value)) {
                return [...accumulated, { name, value, id, type }];
            }
            return accumulated;
        }, []);
};

const mapStateToProps = (state: ReduxState, { searchGroupsForSelectedScope }: OwnProps): PropsFromRedux => {
    const {
        formsValues,
        searchDomain: {
            searchStatus,
            keptFallbackSearchFormValues,
        },
    } = state;

    return {
        keptFallbackSearchFormValues,
        formsValues,
        searchStatus,
        isSearchViaAttributesValid: (minAttributesRequiredToSearch) => {
            const currentSearchTerms = collectCurrentSearchTerms(searchGroupsForSelectedScope, formsValues);

            return Object.values(currentSearchTerms).length >= minAttributesRequiredToSearch;
        },
        isSearchViaUniqueIdValid: (formId) => {
            const searchTerms = formsValues[formId] || {};
            return Object.values(searchTerms).some(value => isValueContainingCharacter(value));
        },
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch, { searchGroupsForSelectedScope }: OwnProps): DispatchersFromRedux => ({
    searchViaUniqueIdOnScopeTrackedEntityType: ({ trackedEntityTypeId, formId }) => {
        dispatch(searchViaUniqueIdOnScopeTrackedEntityType({ trackedEntityTypeId, formId }));
    },
    searchViaUniqueIdOnScopeProgram: ({ programId, formId }) => {
        dispatch(searchViaUniqueIdOnScopeProgram({ programId, formId }));
    },

    searchViaAttributesOnScopeTrackedEntityType: ({ trackedEntityTypeId, formId, resultsPageSize }) => {
        dispatch(searchViaAttributesOnScopeTrackedEntityType({ trackedEntityTypeId, formId, pageSize: resultsPageSize }));
    },
    searchViaAttributesOnScopeProgram: ({ programId, formId, resultsPageSize }) => {
        dispatch(searchViaAttributesOnScopeProgram({ programId, formId, pageSize: resultsPageSize }));
    },
    saveCurrentFormData: ({ searchScopeType, searchScopeId, formId, formsValues }) => {
        const currentSearchTerms = collectCurrentSearchTerms(searchGroupsForSelectedScope, formsValues);

        dispatch(saveCurrentSearchInfo({
            searchScopeType,
            searchScopeId,
            formId,
            currentSearchTerms,
        }));
    },
    addFormIdToReduxStore: (formId, keptFallbackSearchFormValues) => {
        dispatch(addFormData(formId, keptFallbackSearchFormValues));
    },
    removeFormDataFromReduxStore: () => {
        searchGroupsForSelectedScope
            .forEach(({ formId }) => {
                dispatch(removeFormData(formId));
            });
    },
    showUniqueSearchValueEmptyModal: ({ uniqueTEAName }) => {
        dispatch(showUniqueSearchValueEmptyModal({ uniqueTEAName }));
    },
});


export const SearchForm: ComponentType<OwnProps> =
  connect<$Diff<Props, CssClasses>, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(SearchFormComponent);
