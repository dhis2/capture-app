import { connect } from 'react-redux';
import { createOfflineListWrapper } from '../../List';
import { OfflineListContainerCreator } from './OfflineList.containerCreator';
import { isSelectionsEqual } from '../../App/isSelectionsEqual';

const mapStateToProps = (state: any, props: any) => {
    const listSelections = state.workingListsContext[props.listId];
    return {
        hasData: !!(listSelections && isSelectionsEqual(listSelections, state.currentSelections)),
    };
};

export const OfflineListWrapper = connect(mapStateToProps, {})(createOfflineListWrapper(OfflineListContainerCreator));
