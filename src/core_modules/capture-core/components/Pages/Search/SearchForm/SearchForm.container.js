// @flow
import { connect } from 'react-redux';
import { SearchFormComponent } from './SearchForm.component';
import { searchPageActionTypes } from '../SearchPage.container';
import { actionCreator } from '../../../../actions/actions.utils';
import type { DispatchersFromRedux, OwnProps, Props, PropsFromRedux } from './SearchForm.types';


const mapStateToProps = (state: ReduxState, { searchGroupForSelectedScope }): PropsFromRedux => {
    const { forms, searchPage: { searchStatus }, formsValues } = state;

    return {
        // We use the sorted array to always have expanded the first search group section.
        searchGroupForSelectedScope: searchGroupForSelectedScope
            .sort(({ unique: xBoolean }, { unique: yBoolean }) => {
                if (xBoolean === yBoolean) {
                    return 0;
                }
                if (xBoolean) {
                    return -1;
                }
                return 1;
            }),
        forms,
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

const mapDispatchToProps = (dispatch: ReduxDispatch): DispatchersFromRedux => {
    const {
        VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH,
        VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH,
        VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH,
        VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH,
    } = searchPageActionTypes;

    return {
        searchViaUniqueIdOnScopeTrackedEntityType: ({ trackedEntityTypeId, formId }) => {
            dispatch(
                actionCreator(VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH)({ trackedEntityTypeId, formId }),
            );
        },
        searchViaUniqueIdOnScopeProgram: ({ programId, formId }) => {
            dispatch(
                actionCreator(VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH)({ programId, formId }),
            );
        },
        searchViaAttributesOnScopeTrackedEntityType: ({ trackedEntityTypeId, formId }) => {
            dispatch(
                actionCreator(VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH)({ trackedEntityTypeId, formId }),
            );
        },
        searchViaAttributesOnScopeProgram: ({ programId, formId }) => {
            dispatch(
                actionCreator(VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH)({ programId, formId }),
            );
        },

    };
};


export const SearchForm =
  connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(SearchFormComponent);
