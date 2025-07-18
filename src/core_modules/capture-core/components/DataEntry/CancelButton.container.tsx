import { connect } from 'react-redux';
import { CancelButtonComponent } from './CancelButton.component';
import { getDataEntryKey } from './common/getDataEntryKey';
import { dataEntryHasChanges } from './common/dataEntryHasChanges';

const mapStateToProps = (state: any, props: {id: string}) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        dataEntryHasChanges: !!dataEntryHasChanges(state, key),
    };
};

const mapDispatchToProps = () => ({
});

export const CancelButton = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(CancelButtonComponent);
