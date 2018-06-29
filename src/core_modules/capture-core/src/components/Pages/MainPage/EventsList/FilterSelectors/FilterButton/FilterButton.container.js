// @flow
import { connect } from 'react-redux';
import FilterButton from './FilterButton.component';
import { editContents, setFilter, clearFilter, revertFilter } from '../filterSelector.actions';
import { makeFilterValueSelector } from './filterButton.selectors';

const mapStateToProps = () => {
    const filterValueSelector = makeFilterValueSelector();

    return (state: ReduxState, props: Object) => ({
        filterValue: filterValueSelector(state, props),
    });
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onEditContents: (value: any, itemId: string) => {
        dispatch(editContents(value, itemId));
    },
    onSetFilter: (requestData: any, appliedText: string, itemId: string) => {
        dispatch(setFilter(requestData, appliedText, itemId));
    },
    onClearFilter: (itemId: string) => {
        dispatch(clearFilter(itemId));
    },
    onRevertFilter: () => {
        dispatch(revertFilter());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterButton);
