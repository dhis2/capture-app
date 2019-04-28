// @flow
import { connect } from 'react-redux';
import WarningMessageCreator from './WarningMessageCreator.component';
import { reviewDuplicates } from './searchGroupDuplicate.actions';


const mapStateToProps = (state: ReduxState, props: Object) => {
    return {};
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onReviewDuplicates: (onOpenReviewDialog: Function) => {
        dispatch(reviewDuplicates());
        onOpenReviewDialog();
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(WarningMessageCreator);
