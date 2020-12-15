// @flow
export type OwnProps = $ReadOnly<{|
  setScopeId: Function,
  selectedScopeId: string,
  dataEntryId: string,
  onSaveWithoutEnrollment: Function,
  onSaveWithEnrollment: Function,
|}>

export type Props = $ReadOnly<{|
  ...CssClasses,
  ...OwnProps
|}>
