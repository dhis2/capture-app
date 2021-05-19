// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { newEventCancelNewRelationship, addNewEventRelationship } from './NewEventNewRelationshipWrapper.actions';
import { NewRelationshipWrapperComponent } from './NewEventNewRelationshipWrapper.component';
import { makeRelationshipTypesSelector } from './NewEventNewRelationshipWrapper.selectors';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';

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

    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onCancel: (dataEntryId: string) => {
        dispatch(newEventCancelNewRelationship(dataEntryId));
    },
    onAddRelationship: (relationshipType: { id: string, name: string}, entity: Object, entityType: string) => {
        dispatch(addNewEventRelationship(relationshipType, entity, entityType));
    },
});

export const NewRelationshipWrapper: ComponentType<{||}> =
  connect(makeMapStateToProps, mapDispatchToProps)(NewRelationshipWrapperComponent);
