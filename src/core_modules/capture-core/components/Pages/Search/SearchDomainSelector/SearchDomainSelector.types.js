// @flow
import type { SelectedSearchScope, TrackedEntityTypesWithCorrelatedPrograms } from '../SearchPage.types';

export type OwnProps = $ReadOnly<{|
  trackedEntityTypesWithCorrelatedPrograms: TrackedEntityTypesWithCorrelatedPrograms,
  onSelect: ({value: string, label: string}) => void,
  selectedSearchScope: SelectedSearchScope
|}>

export type Props = {|
  ...CssClasses,
  ...OwnProps,
|}

