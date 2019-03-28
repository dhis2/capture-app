// @flow
import { connect } from 'react-redux';
import ColumnSelector from './ColumnSelector.component';
import { updateWorkinglistOrder } from './actions/ColumnSelector.actions';

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateWorkinglistOrder: (listId: string, workinglist: Array<Object>) => {
        dispatch(updateWorkinglistOrder(listId, workinglist));
    },
});

// $FlowSuppress
export default connect(null, mapDispatchToProps)(ColumnSelector);
