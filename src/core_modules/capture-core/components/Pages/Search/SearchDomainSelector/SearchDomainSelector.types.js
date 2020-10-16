// @flow
import type { SelectedSearchScopeId, TrackedEntityTypesWithCorrelatedPrograms } from '../SearchPage.types';
import { typeof searchScopes } from '../SearchPage.constants';

export type OwnProps = $ReadOnly<{|
  trackedEntityTypesWithCorrelatedPrograms: TrackedEntityTypesWithCorrelatedPrograms,
  onSelect: (searchScopeId: string, searchScopeType: $Keys<searchScopes>) => void,
  selectedSearchScopeId: SelectedSearchScopeId
|}>

export type Props = {|
  ...CssClasses,
  ...OwnProps,
|}
