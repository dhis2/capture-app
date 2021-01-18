// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { ReviewDialogContentsPagerComponent } from './ReviewDialogContentsPager.component';
import type { Props, OwnProps } from './ReviewDialogContentsPager.types';

const mapStateToProps = (state: ReduxState) => ({
    currentPage: state.possibleDuplicates.currentPage,
});

const mapDispatchToProps = () => ({});

export const ReviewDialogContentsPager: ComponentType<OwnProps> =
  connect<$Diff<Props, CssClasses>, _, _, _, _, _>(mapStateToProps, mapDispatchToProps)(ReviewDialogContentsPagerComponent);
