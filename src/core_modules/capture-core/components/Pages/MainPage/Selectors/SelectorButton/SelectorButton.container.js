// @flow
import { connect } from 'react-redux';

import SelectorButton from './SelectorButton.component';

import { makeCurrentFilterSelector, makeFilterValueSelector } from './selectorButton.selectors';

const mapStateToProps = () => {
    const getCurrentFilter = makeCurrentFilterSelector();
    const getFilterValue = makeFilterValueSelector();

    // $FlowFixMe[not-an-object] automated comment
    return (state: ReduxState, props: Object) => ({
        filterValue: getFilterValue(getCurrentFilter(state, props), props),
    });
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
});

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(SelectorButton);
