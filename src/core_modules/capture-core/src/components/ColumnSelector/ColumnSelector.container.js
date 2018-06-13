import { connect } from 'react-redux';
import ColumnSelector from './ColumnSelector.component';
import { setColumnVisible } from './actions/ColumnSelector.actions';

const mapStateToProps = (state: Object) => ({
    workingListColumnOrder: state.workingListsColumnsOrder.main,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetColumnVisible: (columnId: string) => {
        dispatch(setColumnVisible(columnId));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(ColumnSelector);
