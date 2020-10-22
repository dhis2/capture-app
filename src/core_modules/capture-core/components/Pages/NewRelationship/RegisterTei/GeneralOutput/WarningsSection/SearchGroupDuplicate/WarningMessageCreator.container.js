// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { WarningMessageCreatorComponent } from './WarningMessageCreator.component';
import { reviewDuplicates } from './searchGroupDuplicate.actions';
import type { OwnProps, Props } from './WarningMessageCreator.types';

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onReviewDuplicates: (pageSize) => { dispatch(reviewDuplicates(pageSize)); },
});

export const WarningMessageCreator: ComponentType<OwnProps> =
  connect<$Diff<Props, CssClasses>, OwnProps, _, _, _, _>(null, mapDispatchToProps)(WarningMessageCreatorComponent);
