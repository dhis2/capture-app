// @flow
import { connect } from 'react-redux';
import DataEntry from './DataEntry.component';
import { updateFormField } from './actions/dataEntry.actions';

const mapStateToProps = (state: Object, props: { id: string }) => ({
    eventId: state.dataEntries[props.id] &&
        state.dataEntries[props.id].eventId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateFieldInner: (
        value: any,
        uiState: Object,
        elementId: string,
        sectionId: string,
        formId: string,
        dataEntryId: string,
        eventId: string,
        onUpdateField: ?(innerAction: ReduxAction<any, any>) => void) => {
        const updateAction = updateFormField(value, uiState, elementId, sectionId, formId, dataEntryId, eventId);

        if (onUpdateField) {
            onUpdateField(updateAction);
        } else {
            dispatch(updateFormField(value, uiState, elementId, sectionId, formId, dataEntryId, eventId));
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DataEntry);
