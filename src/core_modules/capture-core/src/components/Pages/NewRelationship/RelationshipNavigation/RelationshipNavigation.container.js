// @flow
import { connect } from 'react-redux';
import RelationshipNavigation from './RelationshipNavigation.component';


const mapStateToProps = (state: ReduxState) => ({
    searching: state.newRelationship.searching,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(RelationshipNavigation);
