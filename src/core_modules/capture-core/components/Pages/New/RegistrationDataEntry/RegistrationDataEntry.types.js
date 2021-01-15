// @flow
export type OwnProps = $ReadOnly<{|
  setScopeId: Function,
  selectedScopeId: string,
  dataEntryId: string,
|}>

type ContainerProps = {|
  dataEntryIsReady: boolean,
  onSaveWithoutEnrollment: Function,
  onSaveWithEnrollment: Function,
|}

export type Props = $ReadOnly<{|
  ...OwnProps,
  ...CssClasses,
  ...ContainerProps
|}>
