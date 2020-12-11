// @flow
import { connect } from 'react-redux';
import WorkingListsSetup from './WorkingListsSetup.component';

type OwnProps = {|
  listId: string,
|};

type StateProps = {|
  programId: string,
  orgUnitId: string,
  categories: Object,
  lastTransaction: number,
  listContext: ?Object,
|};

type Props = {|
  ...OwnProps,
  ...StateProps,
|};

type MapStateToPropsFactory = (ReduxState, OwnProps) => StateProps;
const mapStateToProps: MapStateToPropsFactory = (state: ReduxState, props: OwnProps) => ({
  programId: state.currentSelections.programId,
  orgUnitId: state.currentSelections.orgUnitId,
  categories: state.currentSelections.categories,
  lastTransaction: state.offline.lastTransaction,
  listContext: state.workingListsContext[props.listId],
});

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps, () => ({}))(WorkingListsSetup);
