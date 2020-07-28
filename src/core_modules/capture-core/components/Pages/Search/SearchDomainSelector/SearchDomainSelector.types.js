// @flow
import type { SelectedSearchScope, TrackedEntityTypesWithCorrelatedPrograms } from '../SearchPage.types';

export type OwnProps = $ReadOnly<{|
  trackedEntityTypesWithCorrelatedPrograms: TrackedEntityTypesWithCorrelatedPrograms,
  classes: Object,
  onSelect: ({value: string, label: string}) => void,
  selectedProgram: SelectedSearchScope
|}>

export type Props = {|
  ...OwnProps,
|}

