// @flow
import { connect } from 'react-redux';
import { ensureState } from 'redux-optimistic-ui';
import DataEntry from './DataEntry.component';
import { updateFormField } from './actions/dataEntry.actions';

const mapStateToProps = (state: Object, props: { id: string }) => ({
    event: state.dataEntries[props.id] && state.dataEntries[props.id].eventId && ensureState(state.events)[state.dataEntries[props.id].eventId],
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateField: (value: any, uiState: Object, elementId: string, sectionId: string, formId: string, dataEntryId: string, eventId: string) => {
        dispatch(updateFormField(value, uiState, elementId, sectionId, formId, dataEntryId, eventId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DataEntry);
