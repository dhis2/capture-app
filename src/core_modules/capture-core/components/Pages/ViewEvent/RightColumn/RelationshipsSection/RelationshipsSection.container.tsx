import { connect } from 'react-redux';
import { RelationshipsSectionComponent } from './RelationshipsSection.component';
import { openAddRelationship } from '../../ViewEventComponent/viewEvent.actions';
import { requestDeleteEventRelationship } from '../../Relationship/ViewEventRelationships.actions';
import { withCustomLabels } from '../../../../../HOC/withCustomLabels';

const customLabels = {
    relationshipsLabel: { key: 'relationship', plural: true },
} as const;

const mapStateToProps = (state: any) => {
    const relationshipsSection = state.viewEventPage.relationshipsSection || {};
    return {
        eventId: state.viewEventPage.eventId,
        programId: state.currentSelections.programId,
        ready: !relationshipsSection.isLoading,
        relationships: state.relationships.viewEvent || [],
        orgUnitId: state.currentSelections.orgUnitId,
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    onOpenAddRelationship: () => {
        dispatch(openAddRelationship());
    },
    onDeleteRelationship: (clientId: string) => {
        dispatch(requestDeleteEventRelationship(clientId));
    },
});

export const RelationshipsSection = connect(mapStateToProps, mapDispatchToProps)(
    withCustomLabels(customLabels)(RelationshipsSectionComponent),
);
