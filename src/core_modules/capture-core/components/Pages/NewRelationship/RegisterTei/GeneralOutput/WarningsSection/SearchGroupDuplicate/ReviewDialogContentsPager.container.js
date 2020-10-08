// @flow
import { connect } from 'react-redux';
import ReviewDialogContentsPager from './ReviewDialogContentsPager.component';
import { changePage } from './searchGroupDuplicate.actions';

const mapStateToProps = (state: ReduxState) => ({
    currentPage: state.newRelationshipRegisterTeiDuplicatesReview.currentPage,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onChangePage: (page: number, pageSize: number) => { dispatch(changePage(page, pageSize)); },
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(ReviewDialogContentsPager);
