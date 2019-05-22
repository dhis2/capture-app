// @flow
import { connect } from 'react-redux';
import ReviewDialogContentsPager from './ReviewDialogContentsPager.component';
import { changePage } from './searchGroupDuplicate.actions';

const mapStateToProps = (state: ReduxState) => ({
    paginationData: state.newRelationshipRegisterTeiDuplicatesReview.paginationData,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onChangePage: (page: number) => {
        dispatch(changePage(page));
    },
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(ReviewDialogContentsPager);
