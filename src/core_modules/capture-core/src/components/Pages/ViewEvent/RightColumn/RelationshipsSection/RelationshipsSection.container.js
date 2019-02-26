// @flow
import { connect } from 'react-redux';
import RelationshipsSection from './RelationshipsSection.component';

import { openAddRelationship } from '../../viewEvent.actions';

import {
    requestDeleteEventRelationship,
} from '../../Relationship/ViewEventRelationships.actions';

const mapStateToProps = (state: ReduxState, props: Object) => ({
    eventId: state.viewEventPage.eventId,
    relationships: state.relationships.viewEvent || [],
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onOpenAddRelationship: () => {
        dispatch(openAddRelationship());
    },
    onDeleteRelationship: (clientId: string) => {
        dispatch(requestDeleteEventRelationship(clientId));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(RelationshipsSection);
