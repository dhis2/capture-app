// @flow
export type OwnProps = {|
    onOpenReviewDialog: () => void,
    dataEntryId: string,
    selectedScopeId: string
|}

export type Props = {| ...OwnProps, ...CssClasses |}
