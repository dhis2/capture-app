// @flow
import { connect } from 'react-redux';
import AddWorkingListConfigDialog from './AddWorkingListConfigDialog.component';
// $FlowFixMe[missing-export] automated comment
import { addWorkingListConfig } from '../eventsList.actions';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
  onAddWorkingListConfig: (name: string, description: string) => {
    // todo addWorkingListConfig is not a function (report lgtm).
    dispatch(addWorkingListConfig(name, description));
  },
});

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(AddWorkingListConfigDialog);
