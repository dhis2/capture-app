// @flow
import { connect } from 'react-redux';
import RelationshipsSection from './RelationshipsSection.component';

import { openAddRelationship } from '../../viewEvent.actions';

const mapStateToProps = (state: ReduxState, props: Object) => ({
    eventId: state.viewEventPage.eventId,
    relationships: state.relationships.viewEvent || [],
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onOpenAddRelationship: () => {
        dispatch(openAddRelationship());
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(RelationshipsSection);
