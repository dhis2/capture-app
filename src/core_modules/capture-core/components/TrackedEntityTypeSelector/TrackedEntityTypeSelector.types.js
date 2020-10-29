// @flow
import type { SelectedSearchScopeId, TrackedEntityTypesWithCorrelatedPrograms } from '../Pages/Search/SearchPage.types';
import { typeof scopeTypes } from '../../metaData';

export type OwnProps = $ReadOnly<{|
  trackedEntityTypesWithCorrelatedPrograms: TrackedEntityTypesWithCorrelatedPrograms,
  onSelect: (searchScopeId: string, searchScopeType: $Keys<scopeTypes>) => void,
  selectedSearchScopeId: SelectedSearchScopeId
|}>

export type Props = {|
  ...CssClasses,
  ...OwnProps,
|}
