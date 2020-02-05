// @flow
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import isDefined from 'd2-utilizr/lib/isDefined';
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
    onFilterUpdate: (listId: string, data: ?Object, itemId: string, commitValue?: any) => {
        const actions = isDefined(commitValue) ? [editContents(listId, commitValue, itemId)] : [];
        actions.push(data == null ? clearFilter(listId, itemId) : setFilter(listId, data, itemId));
        actions.push(workingListUpdating(listId));
        dispatch(batchActions(actions, batchActionTypes.SET_FILTER_BATCH));
    },
    onClearFilter: (listId: string, itemId: string) => {
        dispatch(batchActions([
            clearFilter(listId, itemId),
            workingListUpdating(listId),
        ], batchActionTypes.SET_FILTER_BATCH));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterButton);
