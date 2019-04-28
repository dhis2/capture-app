// @flow
import { connect } from 'react-redux';
import { newEventCancelNewRelationship, addNewEventRelationship } from './NewEventNewRelationshipWrapper.actions';
import NewRelationshipWrapper from './NewEventNewRelationshipWrapper.component';
import { makeRelationshipTypesSelector } from './NewEventNewRelationshipWrapper.selectors';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';

const makeMapStateToProps = () => {
    const relationshipTypesSelector = makeRelationshipTypesSelector();

    const mapStateToProps = (state: ReduxState) => {
        const relationshipTypes = relationshipTypesSelector(state);

        const dataEntryId = 'singleEvent';
        const dataEntryKey = getDataEntryKey(dataEntryId, state.dataEntries[dataEntryId].itemId);
        const unsavedRelationships = state.dataEntriesRelationships[dataEntryKey];
        return {
            relationshipTypes,
            unsavedRelationships,
        };
    };

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
