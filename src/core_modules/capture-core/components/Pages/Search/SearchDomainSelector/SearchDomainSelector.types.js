// @flow
import type { SelectedSearchScopeId, TrackedEntityTypesWithCorrelatedPrograms } from '../SearchPage.types';

export type OwnProps = $ReadOnly<{|
  trackedEntityTypesWithCorrelatedPrograms: TrackedEntityTypesWithCorrelatedPrograms,
  onSelect: ({ selected: string }) => void,
  selectedSearchScopeId: SelectedSearchScopeId
|}>

export type Props = {|
  ...CssClasses,
  ...OwnProps,
|}

