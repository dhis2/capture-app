// @flow
import { connect } from 'react-redux';
import WarningMessageCreator from './WarningMessageCreator.component';
import { reviewDuplicates } from './searchGroupDuplicate.actions';

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
  onReviewDuplicates: (onOpenReviewDialog: Function) => {
    dispatch(reviewDuplicates());
    onOpenReviewDialog();
  },
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export default connect(null, mapDispatchToProps)(WarningMessageCreator);
