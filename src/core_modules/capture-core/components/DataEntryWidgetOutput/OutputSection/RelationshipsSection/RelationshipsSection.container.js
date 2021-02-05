// @flow
import { connect } from 'react-redux';
import RelationshipsSection from './RelationshipsSection.component';
import { openAddRelationship } from '../../../Pages/ViewEvent/ViewEventComponent/viewEvent.actions';
import { requestDeleteEventRelationship } from '../../../Pages/ViewEvent/Relationship/ViewEventRelationships.actions';
import { getEventProgramThrowIfNotFound } from '../../../../metaData';

const mapStateToProps = (state: ReduxState, { selectedScopeId }) => {
    const relationshipsSection = state.viewEventPage.relationshipsSection || {};
    return {
        eventId: state.viewEventPage.eventId,
        ready: !relationshipsSection.isLoading,
        relationships: state.relationships.viewEvent || [],
        orgUnitId: state.currentSelections.orgUnitId,
        programStage: getEventProgramThrowIfNotFound(selectedScopeId).stage,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onOpenAddRelationship: () => {
        dispatch(openAddRelationship());
    },
    onDeleteRelationship: (clientId: string) => {
        dispatch(requestDeleteEventRelationship(clientId));
    },
});

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(RelationshipsSection);
