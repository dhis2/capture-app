// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { ReviewDialogContentsPagerComponent } from './ReviewDialogContentsPager.component';
import { changePage } from './searchGroupDuplicate.actions';


export type DispatchersFromFromRedux = {|
    onChangePage: Function,
|};
type PropsFromRedux = {|
    currentPage: number,
    nextPageButtonDisabled: boolean,
|};

export type Props ={| ...DispatchersFromFromRedux, ...PropsFromRedux, ...CssClasses |}

const mapStateToProps = (state: ReduxState) => ({
    currentPage: state.newRelationshipRegisterTeiDuplicatesReview.paginationData.currentPage,
    nextPageButtonDisabled: state.newRelationshipRegisterTeiDuplicatesReview.paginationData.nextPageButtonDisabled,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onChangePage: (page: number) => { dispatch(changePage(page)); },
});

export const ReviewDialogContentsPager: ComponentType<{||}> =
  connect<$Diff<Props, CssClasses>, _, _, _, _, _>(mapStateToProps, mapDispatchToProps)(ReviewDialogContentsPagerComponent);
