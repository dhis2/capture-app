// @flow
import { connect } from 'react-redux';
import { getDataEntryKey } from './common/getDataEntryKey';
import { dataEntryHasChanges } from './common/dataEntryHasChanges';
import { CancelButtonComponent } from './CancelButton.component';

const mapStateToProps = (state: ReduxState, props: {id: string}) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        dataEntryHasChanges: !!dataEntryHasChanges(state, key),
    };
};

const mapDispatchToProps = () => ({
});

// $FlowFixMe[missing-annot] automated comment
export const CancelButton = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(CancelButtonComponent);
