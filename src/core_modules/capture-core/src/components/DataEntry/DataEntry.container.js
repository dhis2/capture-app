// @flow
import { connect } from 'react-redux';
import DataEntry from './DataEntry.component';
import { updateFormField } from './actions/dataEntry.actions';

const mapStateToProps = (state: Object, props: { id: string }) => ({
    itemId: state.dataEntries[props.id] &&
        state.dataEntries[props.id].itemId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateFieldInner: (
        value: any,
        uiState: Object,
        elementId: string,
        sectionId: string,
        formId: string,
        dataEntryId: string,
        itemId: string,
        onUpdateField: ?(innerAction: ReduxAction<any, any>) => void) => {
        const updateAction = updateFormField(value, uiState, elementId, sectionId, formId, dataEntryId, itemId);

        if (onUpdateField) {
            onUpdateField(updateAction);
        } else {
            dispatch(updateAction);
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DataEntry);
