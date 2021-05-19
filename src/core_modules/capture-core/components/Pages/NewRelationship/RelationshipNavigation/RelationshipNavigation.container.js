// @flow
import { connect } from 'react-redux';
import { RelationshipNavigationComponent } from './RelationshipNavigation.component';


const mapStateToProps = (state: ReduxState) => ({
    searching: state.newRelationship.searching,
});

const mapDispatchToProps = () => ({
});

// $FlowFixMe[missing-annot] automated comment
export const RelationshipNavigation = connect(mapStateToProps, mapDispatchToProps)(RelationshipNavigationComponent);
