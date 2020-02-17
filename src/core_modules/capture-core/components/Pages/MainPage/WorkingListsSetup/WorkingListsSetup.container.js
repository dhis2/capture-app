// @flow
import { connect } from 'react-redux';
import WorkingListsSetup from './WorkingListsSetup.component';

type OwnProps = {||};

type StateProps = {|
    skipReload: boolean,
|};

type Props = {|
   ...OwnProps,
   ...StateProps,
|};

type MapStateToPropsFactory = (ReduxState) => StateProps;
const mapStateToProps: MapStateToPropsFactory = (state: ReduxState) => ({
    skipReload: state.mainPage.preferSkipReloadWorkingLists,
});

export default connect<Props, OwnProps, _, _, _, _>(
    mapStateToProps, () => ({}))(WorkingListsSetup);
