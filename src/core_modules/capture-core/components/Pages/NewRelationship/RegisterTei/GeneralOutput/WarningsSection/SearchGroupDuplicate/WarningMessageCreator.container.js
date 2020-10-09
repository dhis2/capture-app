// @flow
import { connect } from 'react-redux';
import { WarningMessageCreatorComponent } from './WarningMessageCreator.component';
import { reviewDuplicates } from './searchGroupDuplicate.actions';


const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onReviewDuplicates: () => { dispatch(reviewDuplicates()); },
});

// $FlowFixMe[missing-annot] automated comment
export const WarningMessageCreator = connect(null, mapDispatchToProps)(WarningMessageCreatorComponent);
