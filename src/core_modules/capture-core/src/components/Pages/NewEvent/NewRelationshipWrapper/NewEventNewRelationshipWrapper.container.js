// @flow
import { connect } from 'react-redux';
import { newEventCancelNewRelationship, addNewEventRelationship } from './NewEventNewRelationshipWrapper.actions';
import NewRelationshipWrapper from './NewEventNewRelationshipWrapper.component';
import { makeRelationshipTypesSelector } from './NewEventNewRelationshipWrapper.selectors';

const makeMapStateToProps = () => {
    const relationshipTypesSelector = makeRelationshipTypesSelector();

    const mapStateToProps = (state: ReduxState) => {
        const relationshipTypes = relationshipTypesSelector(state);

        return {
            relationshipTypes,
        };
    };

    // $FlowSuppress
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onCancel: (formHorizontal: boolean) => {
        dispatch(newEventCancelNewRelationship());
    },
    onAddRelationship: (relationshipTypeId: string, entityId: string, entityType: string) => {
        dispatch(addNewEventRelationship(relationshipTypeId, entityId, entityType));
    },
});

// $FlowSuppress
export default connect(makeMapStateToProps, mapDispatchToProps)(NewRelationshipWrapper);
