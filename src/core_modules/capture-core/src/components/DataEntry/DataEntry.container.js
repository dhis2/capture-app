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
        dataEntryId: string,
        itemId: string,
        onUpdateField: ?(innerAction: ReduxAction<any, any>) => void,
        value: any,
        uiState: Object,
        elementId: string,
        formBuilderId: string,
        formId: string,
        updateCompleteUid: string,
    ) => {
        const updateAction = updateFormField(
            value,
            uiState,
            elementId,
            formBuilderId,
            formId,
            dataEntryId,
            itemId,
            updateCompleteUid,
        );

        if (onUpdateField) {
            onUpdateField(updateAction);
        } else {
            dispatch(updateAction);
        }
    },
});
// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DataEntry);
