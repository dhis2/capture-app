// @flow
import { connect } from 'react-redux';
import ListWrapperMenu from './ListWrapperMenu.component';
import { updateWorkinglistOrder } from './actions/columnSelectorDialog.actions';

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateWorkinglistOrder: (listId: string, workinglist: Array<Object>) => {
        dispatch(updateWorkinglistOrder(listId, workinglist));
    },
});

// $FlowSuppress
export default connect(null, mapDispatchToProps)(ListWrapperMenu);
