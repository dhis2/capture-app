// @flow
import { connect } from 'react-redux';
import type { ComponentType } from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core';
import { getStyles, SearchFormComponent } from './SearchForm.component';
import type { CurrentSearchTerms, DispatchersFromRedux, OwnProps, Props, PropsFromRedux } from './SearchForm.types';
import {
    searchPageActionTypes,
    searchViaAttributesOnScopeProgram,
    searchViaAttributesOnScopeTrackedEntityType,
    searchViaUniqueIdOnScopeProgram,
    searchViaUniqueIdOnScopeTrackedEntityType,
} from '../SearchPage.actions';
import { actionCreator } from '../../../../actions/actions.utils';
import { addFormData } from '../../../D2Form/actions/form.actions';

const isValueContainingCharacter = string => string.replace(/\s/g, '').length;

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
            const { name, id } = attributeSearchForm.getElement(attributeValueKey);
            const value = searchTerms[attributeValueKey];
            if (isValueContainingCharacter(value)) {
                return [...accumulated, { name, value, id }];
            }
            return accumulated;
        }, []);
};

const mapStateToProps = (state: ReduxState): PropsFromRedux => {
    const {
        forms,
        formsValues,
        searchPage: {
            searchStatus,
        },
    } = state;


    return {
        forms,
        formsValues,
        searchStatus,
        isSearchViaAttributesValid: (minAttributesRequiredToSearch, formId) => {
            const formValues = formsValues[formId] || {};
            const currentNumberOfFilledInputValues =
              Object.keys(formValues)
                  .filter((key) => {
                      const value = formValues[key];
                      return value && isValueContainingCharacter(value);
                  })
                  .length;

            return currentNumberOfFilledInputValues >= minAttributesRequiredToSearch;
        },
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch, ownProps: OwnProps): DispatchersFromRedux => ({
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
    saveCurrentFormData: (searchScopeType, searchScopeId, formId, formsValues) => {
        const currentSearchTerms =
          collectCurrentSearchTerms(ownProps.searchGroupsForSelectedScope, formsValues);

        dispatch(actionCreator(searchPageActionTypes.CURRENT_SEARCH_INFO_SAVE)(
            { searchScopeType,
                searchScopeId,
                formId,
                currentSearchTerms,
            }));
    },
    addFormIdToReduxStore: (formId) => { dispatch(addFormData(formId)); },
});


export const SearchForm: ComponentType<OwnProps> =
  compose(
      connect<Props, OwnProps & CssClasses, _, _, _, _>(mapStateToProps, mapDispatchToProps),
      withStyles(getStyles),
  )(SearchFormComponent);
