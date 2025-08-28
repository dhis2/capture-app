import { connect } from 'react-redux';
import { NewRelationshipComponent } from './NewRelationship.component';
import type { SelectedRelationshipType } from './newRelationship.types';
import { findModes } from './findModes';
import {
    selectRelationshipType,
    deselectRelationshipType,
    selectFindMode,
    initializeNewRelationship,
} from './newRelationship.actions';

const mapStateToProps = (state: any) => ({
    selectedRelationshipType: state.newRelationship.selectedRelationshipType,
    findMode: state.newRelationship.findMode,
});

const mapDispatchToProps = (dispatch: any) => ({
    onInitializeNewRelationship: () => {
        dispatch(initializeNewRelationship());
    },
    onSelectRelationshipType: (selectedRelationshipType: SelectedRelationshipType) => {
        dispatch(selectRelationshipType(selectedRelationshipType));
    },
    onDeselectRelationshipType: () => {
        dispatch(deselectRelationshipType());
    },
    onSelectFindMode: (findMode: typeof findModes[keyof typeof findModes]) => {
        dispatch(selectFindMode(findMode));
    },
});

export const NewRelationship = connect(mapStateToProps, mapDispatchToProps)(NewRelationshipComponent);
