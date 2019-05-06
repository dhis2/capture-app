// @flow
import { connect } from 'react-redux';
import ColumnSelectorDialog from './ColumnSelectorDialog.component';
import { updateWorkinglistOrder } from './actions/ColumnSelectorDialog.actions';

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateWorkinglistOrder: (listId: string, workinglist: Array<Object>) => {
        dispatch(updateWorkinglistOrder(listId, workinglist));
    },
});

// $FlowSuppress
export default connect(null, mapDispatchToProps)(ColumnSelectorDialog);
