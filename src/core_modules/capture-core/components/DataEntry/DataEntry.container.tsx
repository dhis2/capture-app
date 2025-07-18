import { connect } from 'react-redux';
import { DataEntryComponent } from './DataEntry.component';
import { updateFormField } from './actions/dataEntry.actions';
import { withLoadingIndicator } from '../../HOC';

type OwnProps = {
    id: string;
};

const mapStateToProps = (state: any, props: OwnProps) => ({
    itemId: state.dataEntries[props.id] && state.dataEntries[props.id].itemId,
    ready: !!state.dataEntries[props.id],
});

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateFieldInner: (
        dataEntryId: string,
        itemId: string,
        onUpdateField: ((innerAction: any) => void) | undefined,
        value: any,
        uiState: Record<string, any>,
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

export const DataEntry = connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator(() => ({ height: '350px' }))(DataEntryComponent),
);
