// @flow
import { connect } from 'react-redux';
import { SearchFormComponent } from './SearchForm.component';
import type { DispatchersFromRedux, OwnProps, Props, PropsFromRedux } from './SearchForm.types';
import {
    searchPageActionTypes,
    searchViaAttributesOnScopeProgram,
    searchViaAttributesOnScopeTrackedEntityType,
    searchViaUniqueIdOnScopeProgram,
    searchViaUniqueIdOnScopeTrackedEntityType,
} from '../SearchPage.actions';
import { actionCreator } from '../../../../actions/actions.utils';

const currentSearchTerms = (searchGroupForSelectedScope, formsValues) => {
    const { searchForm: attributeSearchForm, formId } = searchGroupForSelectedScope
        .reduce((accumulated, searchGroup) => {
            if (!searchGroup.unique) {
                return { accumulated, ...searchGroup };
            }
            return accumulated;
        }, {});
    const searchTerms = formsValues[formId] || {};
    return Object.keys(searchTerms)
        .reduce((accumulated, attributeValueKey) => {
            const { name, id } = attributeSearchForm.getElement(attributeValueKey);
            const value = searchTerms[attributeValueKey];
            return [...accumulated, { name, value, id }];
        }, []);
};

const mapStateToProps = (state: ReduxState, { searchGroupForSelectedScope }): PropsFromRedux => {
    const {
        forms,
        formsValues,
        searchPage: {
            searchStatus,
        },
    } = state;


    return {
        forms,
        currentSearchTerms: currentSearchTerms(searchGroupForSelectedScope, formsValues),
        searchStatus,
        isSearchViaAttributesValid: (minAttributesRequiredToSearch, formId) => {
            const formValues = formsValues[formId] || {};
            const currentNumberOfFilledInputValues =
              Object.keys(formValues)
                  .filter(key => formValues[key])
                  .length;

            return currentNumberOfFilledInputValues >= minAttributesRequiredToSearch;
        },
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch): DispatchersFromRedux => ({
    searchViaUniqueIdOnScopeTrackedEntityType: ({ trackedEntityTypeId, formId }) => {
        dispatch(searchViaUniqueIdOnScopeTrackedEntityType({ trackedEntityTypeId, formId }));
    },
    searchViaUniqueIdOnScopeProgram: ({ programId, formId }) => {
        dispatch(searchViaUniqueIdOnScopeProgram({ programId, formId }));
    },

    searchViaAttributesOnScopeTrackedEntityType: ({ trackedEntityTypeId, formId }) => {
        dispatch(searchViaAttributesOnScopeTrackedEntityType({ trackedEntityTypeId, formId }));
    },
    searchViaAttributesOnScopeProgram: ({ programId, formId, page }) => {
        dispatch(searchViaAttributesOnScopeProgram({ programId, formId, page }));
    },
    saveCurrentFormData: (searchScopeType, searchScopeId, formId, currentSearchTerms) => {
        dispatch(actionCreator(searchPageActionTypes.CURRENT_SEARCH_INFO_SAVE)({ searchScopeType, searchScopeId, formId, currentSearchTerms }));
    },
});


export const SearchForm =
  connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(SearchFormComponent);
