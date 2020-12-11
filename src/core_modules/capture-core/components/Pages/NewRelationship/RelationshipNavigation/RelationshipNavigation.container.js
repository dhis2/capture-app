// @flow
import { connect } from 'react-redux';
import RelationshipNavigation from './RelationshipNavigation.component';

const mapStateToProps = (state: ReduxState) => ({
  searching: state.newRelationship.searching,
});

const mapDispatchToProps = () => ({});

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(RelationshipNavigation);
