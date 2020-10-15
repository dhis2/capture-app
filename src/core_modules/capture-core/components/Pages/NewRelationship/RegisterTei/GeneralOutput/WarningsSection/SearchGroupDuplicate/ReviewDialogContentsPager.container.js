// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { ReviewDialogContentsPagerComponent } from './ReviewDialogContentsPager.component';
import { changePage } from './searchGroupDuplicate.actions';
import type { Props, OwnProps } from './ReviewDialogContentsPager.types';

const mapStateToProps = (state: ReduxState) => ({
    currentPage: state.newRelationshipRegisterTeiDuplicatesReview.currentPage,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onChangePage: (page: number, pageSize: number) => { dispatch(changePage(page, pageSize)); },
});

export const ReviewDialogContentsPager: ComponentType<OwnProps> =
  connect<$Diff<Props, CssClasses>, _, _, _, _, _>(mapStateToProps, mapDispatchToProps)(ReviewDialogContentsPagerComponent);
