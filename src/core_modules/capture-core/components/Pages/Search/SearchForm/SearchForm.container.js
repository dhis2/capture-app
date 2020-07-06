// @flow
import { connect } from 'react-redux';
import { SearchFormComponent } from './SearchForm.component';
import { searchPageActionTypes } from '../SearchPage.container';
import { actionCreator } from '../../../../actions/actions.utils';
import type { DispatchersFromRedux, OwnProps, Props, PropsFromRedux } from './SearchForm.types';


const mapStateToProps = (state: ReduxState): PropsFromRedux => {
    const { forms } = state;
    return {
        forms,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch): DispatchersFromRedux => {
    const {
        SCOPE_TRACKED_ENTITY_TYPE_USING_UNIQUE_IDENTIFIER_FIND,
        SCOPE_PROGRAM_USING_UNIQUE_IDENTIFIER_FIND,
    } = searchPageActionTypes;

    return {
        onScopeTrackedEntityTypeFindUsingUniqueIdentifier: ({ trackedEntityTypeId, formId }) => {
            dispatch(
                actionCreator(SCOPE_TRACKED_ENTITY_TYPE_USING_UNIQUE_IDENTIFIER_FIND)({ trackedEntityTypeId, formId }),
            );
        },
        onScopeProgramFindUsingUniqueIdentifier: ({ programId, formId }) => {
            dispatch(
                actionCreator(SCOPE_PROGRAM_USING_UNIQUE_IDENTIFIER_FIND)({ programId, formId }),
            );
        },
    };
};


export const SearchForm =
  connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(SearchFormComponent);
