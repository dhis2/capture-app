import { connect } from 'react-redux';
import { RelationshipNavigationComponent } from './RelationshipNavigation.component';

const mapStateToProps = (state: any) => ({
    searching: state.newRelationship.searching,
});

const mapDispatchToProps = () => ({
});

export const RelationshipNavigation = connect(mapStateToProps, mapDispatchToProps)(RelationshipNavigationComponent);
