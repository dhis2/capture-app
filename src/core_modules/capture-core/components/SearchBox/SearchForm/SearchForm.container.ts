import { connect } from 'react-redux';
import type { ComponentType } from 'react';
import { isObject, isString } from 'd2-utilizr/src';
import { convertFormToClient } from 'capture-core/converters';
import { SearchFormComponent } from './SearchForm.component';
import type { CurrentSearchTerms, DispatchersFromRedux, OwnProps, PropsFromRedux } from './SearchForm.types';
import type { ReduxDispatch } from '../../App/withAppUrlSync.types';
import {
    saveCurrentSearchInfo,
    searchViaAttributesOnScopeProgram,
    searchViaAttributesOnScopeTrackedEntityType,
    searchViaUniqueIdOnScopeProgram,
    searchViaUniqueIdOnScopeTrackedEntityType,
    showUniqueSearchValueEmptyModal,
} from '../SearchBox.actions';
import { addFormData, removeFormData } from '../../D2Form/actions/form.actions';

type ReduxState = {
    formsValues: Record<string, Record<string, any>>;
    searchDomain: {
        searchStatus: string;
        keptFallbackSearchFormValues: Record<string, any>;
    };
};

const isValueContainingCharacter = (value: any) => {
    if (!value) {
        return false;
    }
    if (isString(value)) {
        return Boolean(value.replace(/\s/g, '').length);
    }

    if (isObject(value)) {
        if ('from' in value && 'to' in value) {
            const fromValues = isObject(value.from) ?
                [value.from.time, value.from.date] :
                [value.from];

            const toValues = isObject(value.to) ?
                [value.to.time, value.to.date] :
                [value.to];

            const allValues = [...fromValues, ...toValues];
            const validValues = allValues
                .filter(v => isString(v))
                .filter(v => Boolean(v?.replace(/\s/g, '').length))
                .length;

            return validValues === allValues.length;
        }

        const numberOfValuesWithLength = Object.values(value)
            .filter(v => isString(v))
            .filter((v: any) => Boolean(v.replace(/\s/g, '').length))
            .length;

        return Boolean(numberOfValuesWithLength === Object.keys(value).length);
    }
    return true;
};

const collectCurrentSearchTerms = (searchGroupsForSelectedScope: any[], formsValues: Record<string, Record<string, any>>): CurrentSearchTerms => {
    const { searchForm: attributeSearchForm, formId } = searchGroupsForSelectedScope
        .reduce((accumulated: any, searchGroup: any) => {
            if (!searchGroup.unique) {
                return { accumulated, ...searchGroup };
            }
            return accumulated;
        }, {});

    const searchTerms = formsValues[formId] || {};
    return Object.keys(searchTerms)
        .reduce((accumulated: CurrentSearchTerms, attributeValueKey) => {
            const { name, id, type } = attributeSearchForm.getElement(attributeValueKey);
            const value = searchTerms[attributeValueKey];
            if (isValueContainingCharacter(value)) {
                const convertedValue = convertFormToClient(value, type);
                return [...accumulated, { name, value: convertedValue, id, type }];
            }
            return accumulated;
        }, [] as CurrentSearchTerms);
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
        dispatch(searchViaUniqueIdOnScopeTrackedEntityType({ trackedEntityTypeId, formId, programId: null }));
    },
    searchViaUniqueIdOnScopeProgram: ({ programId, formId }) => {
        dispatch(searchViaUniqueIdOnScopeProgram({ programId, formId }));
    },

    searchViaAttributesOnScopeTrackedEntityType: ({ trackedEntityTypeId, formId, resultsPageSize }) => {
        dispatch(searchViaAttributesOnScopeTrackedEntityType({ trackedEntityTypeId, formId, pageSize: resultsPageSize, triggeredFrom: null }));
    },
    searchViaAttributesOnScopeProgram: ({ programId, formId, resultsPageSize }) => {
        dispatch(searchViaAttributesOnScopeProgram({ programId, formId, pageSize: resultsPageSize, triggeredFrom: null }));
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
            .forEach(({ formId }: { formId: string }) => {
                dispatch(removeFormData(formId));
            });
    },
    showUniqueSearchValueEmptyModal: ({ uniqueTEAName }) => {
        dispatch(showUniqueSearchValueEmptyModal({ uniqueTEAName }));
    },
});

export const SearchForm: ComponentType<OwnProps> =
  connect(mapStateToProps, mapDispatchToProps)(SearchFormComponent);
