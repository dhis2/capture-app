// @flow
import type { SelectedSearchScopeId } from '../Pages/Search/SearchPage.types';
import { typeof scopeTypes } from '../../metaData';

export type OwnProps = $ReadOnly<{|
  onSelect: (searchScopeId: string, searchScopeType: $Keys<scopeTypes>) => void,
  selectedSearchScopeId: SelectedSearchScopeId
|}>

export type Props = {|
  ...CssClasses,
  ...OwnProps,
|}
