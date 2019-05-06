// @flow
import { connect } from 'react-redux';
import CancelButton from './CancelButton.component';
import getDataEntryKey from './common/getDataEntryKey';
import dataEntryHasChanges from './common/dataEntryHasChanges';

const mapStateToProps = (state: ReduxState, props: {id: string}) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        finalInProgress: !!(state.dataEntriesUI[key] && state.dataEntriesUI[key].finalInProgress),
        dataEntryHasChanges: !!dataEntryHasChanges(state, key),
    };
};

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(CancelButton);
