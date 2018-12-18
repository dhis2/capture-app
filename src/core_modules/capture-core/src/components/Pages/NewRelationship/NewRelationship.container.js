// @flow
import { connect } from 'react-redux';
import NewRelationship from './NewRelationship.component';
import {
    selectRelationshipType,
    deselectRelationshipType,
} from './newRelationship.actions';

import {
    makeSelectedRelationshipTypeSelector,
} from './newRelationship.selectors';


const makeMapStateToProps = () => {
    const relationshipTypesSelector = makeSelectedRelationshipTypeSelector();

    const mapStateToProps = (state: ReduxState, props: Object) => ({
        selectedRelationshipType: relationshipTypesSelector(state, props),
        findMode: state.newRelationship.findMode,
    });

    // $FlowSuppress
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSelectRelationshipType: (selectedRelationshipTypeId: string) => {
        dispatch(selectRelationshipType(selectedRelationshipTypeId));
    },
    onDeselectRelationshipType: () => {
        dispatch(deselectRelationshipType());
    },
});

// $FlowSuppress
export default connect(makeMapStateToProps, mapDispatchToProps)(NewRelationship);
