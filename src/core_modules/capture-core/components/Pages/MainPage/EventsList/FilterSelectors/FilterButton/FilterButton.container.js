// @flow
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import FilterButton from './FilterButton.component';
import { editContents, setFilter, clearFilter, batchActionTypes } from '../filterSelector.actions';
import { workingListUpdating } from '../../eventsList.actions';
import { makeCurrentFilterSelector, makeFilterValueSelector } from './filterButton.selectors';

const mapStateToProps = () => {
    const getCurrentFilter = makeCurrentFilterSelector();
    const getFilterValue = makeFilterValueSelector();

    return (state: ReduxState, props: Object) => ({
        filterValue: getFilterValue(getCurrentFilter(state, props), props),
    });
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onEditFilterContents: (listId: string, value: any, itemId: string) => {
        dispatch(editContents(listId, value, itemId));
    },
    onFilterUpdate: (listId: string, data: ?Object, itemId: string) => {
        const action = data == null ? clearFilter(listId, itemId) : setFilter(listId, data, itemId);
        dispatch(action);
    },
    onClearFilter: (listId: string, itemId: string) => {
        dispatch(batchActions([
            clearFilter(listId, itemId),
            workingListUpdating(listId),
        ], batchActionTypes.SET_FILTER_BATCH));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterButton);
