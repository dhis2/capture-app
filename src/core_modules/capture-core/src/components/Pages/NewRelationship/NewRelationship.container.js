// @flow
import { connect } from 'react-redux';
import NewRelationship from './NewRelationship.component';
import {
    setSelectedRelationshipType,
} from './newRelationship.actions';


const mapStateToProps = (state: ReduxState) => ({
    selectedRelationshipTypeId: state.newRelationship.selectedRelationshipTypeId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetSelectedRelationshipType: (selectedRelationshipTypeId: string) => {
        dispatch(setSelectedRelationshipType(selectedRelationshipTypeId));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(NewRelationship);
