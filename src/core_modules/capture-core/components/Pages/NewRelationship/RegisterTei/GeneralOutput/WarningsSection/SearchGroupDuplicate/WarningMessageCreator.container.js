// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { WarningMessageCreatorComponent } from './WarningMessageCreator.component';
import { reviewDuplicates } from './searchGroupDuplicate.actions';


type OwnProps = {|
    onOpenReviewDialog: () => void,
|}
type DispatchersFromRedux = {|
    onReviewDuplicates: (onOpenReviewDialog: Function) => void,
|}
export type Props = {| ...DispatchersFromRedux, ...OwnProps, ...CssClasses |}

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onReviewDuplicates: () => { dispatch(reviewDuplicates()); },
});

export const WarningMessageCreator: ComponentType<OwnProps> =
  connect<$Diff<Props, CssClasses>, OwnProps, _, _, _, _>(null, mapDispatchToProps)(WarningMessageCreatorComponent);
