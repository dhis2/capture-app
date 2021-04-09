// @flow
import { connect } from 'react-redux';
import { CancelButton as CancelButtonComponent } from './CancelButton.component';
import { getDataEntryKey } from './common/getDataEntryKey';
import { getDataEntryHasChanges } from './common/dataEntryHasChanges';

const mapStateToProps = (state: ReduxState, props: {id: string}) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        dataEntryHasChanges: !!getDataEntryHasChanges(state, key),
    };
};

const mapDispatchToProps = () => ({
});

// $FlowFixMe[missing-annot] automated comment
export const CancelButton = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(CancelButtonComponent);
