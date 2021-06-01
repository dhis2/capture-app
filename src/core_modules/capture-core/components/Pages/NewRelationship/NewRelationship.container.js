// @flow
import { connect } from 'react-redux';
import { NewRelationshipComponent } from './NewRelationship.component';
import type { SelectedRelationshipType } from './newRelationship.types';
import {
    selectRelationshipType,
    deselectRelationshipType,
    selectFindMode,
    initializeNewRelationship,
} from './newRelationship.actions';

const mapStateToProps = (state: ReduxState) => ({
    selectedRelationshipType: state.newRelationship.selectedRelationshipType,
    findMode: state.newRelationship.findMode,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onInitializeNewRelationship: () => {
        dispatch(initializeNewRelationship());
    },
    onSelectRelationshipType: (selectedRelationshipType: SelectedRelationshipType) => {
        dispatch(selectRelationshipType(selectedRelationshipType));
    },
    onDeselectRelationshipType: () => {
        dispatch(deselectRelationshipType());
    },
    onSelectFindMode: (findMode: string) => {
        dispatch(selectFindMode(findMode));
    },
});

// $FlowFixMe[missing-annot] automated comment
export const NewRelationship = connect(mapStateToProps, mapDispatchToProps)(NewRelationshipComponent);
