// @flow
import { connect } from 'react-redux';
import { type ComponentType } from 'react';
import type { Props, OwnProps } from './ReviewDialogContentsPager.types';
import { ReviewDialogContentsPagerComponent } from './ReviewDialogContentsPager.component';

const mapStateToProps = (state: ReduxState) => ({
    currentPage: state.possibleDuplicates.currentPage,
});

const mapDispatchToProps = () => ({});

export const ReviewDialogContentsPager: ComponentType<OwnProps> =
  connect<$Diff<Props, CssClasses>, _, _, _, _, _>(mapStateToProps, mapDispatchToProps)(ReviewDialogContentsPagerComponent);
