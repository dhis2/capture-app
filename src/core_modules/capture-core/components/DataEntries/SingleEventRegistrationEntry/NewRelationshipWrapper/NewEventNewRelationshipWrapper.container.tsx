import type { ComponentType } from 'react';
import { connect } from 'react-redux';
import { newEventCancelNewRelationship, addNewEventRelationship } from './NewEventNewRelationshipWrapper.actions';
import { NewRelationshipWrapperComponent } from './NewEventNewRelationshipWrapper.component';
import { makeRelationshipTypesSelector } from './NewEventNewRelationshipWrapper.selectors';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';

const makeMapStateToProps = () => {
    const relationshipTypesSelector = makeRelationshipTypesSelector();

    const mapStateToProps = (state: any) => {
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

const mapDispatchToProps = (dispatch: any) => ({
    onCancel: (dataEntryId: string) => {
        dispatch(newEventCancelNewRelationship(dataEntryId));
    },
    onAddRelationship: (
        relationshipType: { id: string; name: string },
        entity: Record<string, unknown>,
        entityType: string
    ) => {
        dispatch(addNewEventRelationship(relationshipType, entity, entityType));
    },
});

export const NewRelationshipWrapper: ComponentType<Record<string, never>> =
  connect(makeMapStateToProps, mapDispatchToProps)(NewRelationshipWrapperComponent);
