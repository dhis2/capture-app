// @flow
export type OwnProps = {|
  onOpenReviewDialog: () => void,
|};
type DispatchersFromRedux = {|
  onReviewDuplicates: (onOpenReviewDialog: Function) => void,
|};
export type Props = {| ...DispatchersFromRedux, ...OwnProps, ...CssClasses |};
