// @flow
import { connect } from 'react-redux';
import { SearchFormComponent } from './SearchForm.component';
import { searchPageActionTypes } from '../SearchPage.container';
import { actionCreator } from '../../../../actions/actions.utils';
import type { DispatchersFromRedux, OwnProps, Props, PropsFromRedux } from './SearchForm.types';


const mapStateToProps = (state: ReduxState): PropsFromRedux => {
    const { forms, searchPage: { searchStatus } } = state;
    return {
        forms,
        searchStatus,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch): DispatchersFromRedux => {
    const {
        VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH,
        VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH,
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
    };
};


export const SearchForm =
  connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(SearchFormComponent);
