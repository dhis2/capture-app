// @flow
import { connect } from 'react-redux';
import { isSelectionsEqual } from '../../App/isSelectionsEqual';
import { createOfflineListWrapper } from '../../List';
import { OfflineListContainerCreator } from './OfflineList.containerCreator';

const mapStateToProps = (state: ReduxState, props: Object) => {
    const listSelections = state.workingListsContext[props.listId];
    return {
        hasData: !!(listSelections && isSelectionsEqual(listSelections, state.currentSelections)),
    };
};

// $FlowFixMe[missing-annot] automated comment
export const OfflineListWrapper = connect(mapStateToProps, {})(createOfflineListWrapper(OfflineListContainerCreator));
