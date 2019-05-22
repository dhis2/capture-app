// @flow
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions'; 
import isDefined from 'd2-utilizr/lib/isDefined';
import FilterButton from './FilterButton.component';
import { editContents, setFilter, clearFilter, revertFilter, batchActionTypes } from '../filterSelector.actions';
import { workingListUpdating } from '../../eventsList.actions';
import { makeFilterValueSelector } from './filterButton.selectors';

const mapStateToProps = () => {
    const filterValueSelector = makeFilterValueSelector();

    return (state: ReduxState, props: Object) => ({
        filterValue: filterValueSelector(state, props),
    });
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onEditFilterContents: (value: any, itemId: string) => {
        dispatch(editContents(value, itemId));
    },
    onFilterUpdate: (data: ?Object, itemId: string, commitValue?: any) => {
        const actions = isDefined(commitValue) ? [editContents(commitValue, itemId)] : [];
        actions.push(data == null ? clearFilter(itemId) : setFilter(data, itemId));
        actions.push(workingListUpdating());
        dispatch(batchActions(actions, batchActionTypes.SET_FILTER_BATCH));
    },
    onClearFilter: (itemId: string) => {
        dispatch(clearFilter(itemId));
    },
    onRevertFilter: () => {
        dispatch(revertFilter());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterButton);
