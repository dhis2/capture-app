// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { ReviewDialogContentsPagerComponent } from './ReviewDialogContentsPager.component';
import { changePage } from './searchGroupDuplicate.actions';


type OwnProps = {|
    nextPageButtonDisabled: boolean,
|};
export type DispatchersFromFromRedux = {|
    onChangePage: Function,
|};
type PropsFromRedux = {|
    currentPage: number,
|};

export type Props ={| ...OwnProps, ...DispatchersFromFromRedux, ...PropsFromRedux, ...CssClasses |}

const mapStateToProps = (state: ReduxState) => ({
    currentPage: state.newRelationshipRegisterTeiDuplicatesReview.currentPage,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onChangePage: (page: number, pageSize: number) => { dispatch(changePage(page, pageSize)); },
});

export const ReviewDialogContentsPager: ComponentType<OwnProps> =
  connect<$Diff<Props, CssClasses>, _, _, _, _, _>(mapStateToProps, mapDispatchToProps)(ReviewDialogContentsPagerComponent);
