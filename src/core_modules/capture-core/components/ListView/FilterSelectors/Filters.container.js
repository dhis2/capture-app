// @flow
import { connect } from 'react-redux';
import Filters from './Filters.component';
import { restMenuItemSelected } from './filterSelector.actions';
import { makeOnItemSelectedSelector } from './filters.selectors';

const mapStateToProps = (state: ReduxState, props: Object) => ({
    stickyFilters: state.workingListsStickyFilters[props.listId],
});

const mapDispatchToProps = () => {
    const onItemSelectedMemoized = makeOnItemSelectedSelector();

    return (dispatch: ReduxDispatch, props: Object) => ({
        onRestMenuItemSelected: onItemSelectedMemoized({
            dispatch,
            listId: props.listId,
            onItemSelected: restMenuItemSelected,
        }),
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
