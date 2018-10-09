// @flow
import { connect } from 'react-redux';
import getDataEntryKey from './common/getDataEntryKey';
import DataEntryNotes from './DataEntryNotes.component';

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        itemId,
        notes: state.dataEntriesNotes[key] || [],
    };
};

export default connect(mapStateToProps, () => ({}), null, { withRef: true })(DataEntryNotes);
