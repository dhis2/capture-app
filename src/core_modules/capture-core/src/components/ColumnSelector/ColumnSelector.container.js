// @flow
import { connect } from 'react-redux';
import ColumnSelector from './ColumnSelector.component';
import { updateWorkinglistOrder } from './actions/ColumnSelector.actions';

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateWorkinglistOrder: (workinglist: Array<Object>) => {
        dispatch(updateWorkinglistOrder(workinglist));
    },
});

// $FlowSuppress
export default connect(null, mapDispatchToProps)(ColumnSelector);
