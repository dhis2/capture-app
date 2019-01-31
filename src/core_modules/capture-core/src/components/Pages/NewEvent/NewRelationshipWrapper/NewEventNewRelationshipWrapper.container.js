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
    onAddRelationship: (relationshipType: { id: string, name: string}, entity: Object, entityType: string) => {
        dispatch(addNewEventRelationship(relationshipType, entity, entityType));
    },
});

// $FlowSuppress
export default connect(makeMapStateToProps, mapDispatchToProps)(NewRelationshipWrapper);
