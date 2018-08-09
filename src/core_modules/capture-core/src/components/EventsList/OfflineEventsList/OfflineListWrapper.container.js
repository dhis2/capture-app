// @flow
import { connect } from 'react-redux';
import createOfflineListWrapper from '../../List/OfflineList/createOfflineListWrapper';
import OfflineListContainerCreator from './OfflineList.containerCreator';

const mapStateToProps = (state: ReduxState, props: Object) => ({
    hasData: !!(state.workingListsContext[props.listId]),
});

export default connect(mapStateToProps, {})(createOfflineListWrapper(OfflineListContainerCreator));
