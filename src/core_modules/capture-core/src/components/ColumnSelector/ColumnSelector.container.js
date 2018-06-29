import { connect } from 'react-redux';
import ColumnSelector from './ColumnSelector.component';
import { updateWorkinglistOrder } from './actions/ColumnSelector.actions';

const mapStateToProps = (state: Object) => ({
    workingListColumnOrder: state.workingListsColumnsOrder.main,
    selectedProgramId: state.currentSelections.programId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateWorkinglistOrder: (workinglist: Array) => {
        dispatch(updateWorkinglistOrder(workinglist));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(ColumnSelector);
