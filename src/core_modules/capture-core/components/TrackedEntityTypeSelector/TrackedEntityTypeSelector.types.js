// @flow
import { typeof scopeTypes } from '../../metaData';

export type OwnProps = $ReadOnly<{|
  onSelect: (searchScopeId: string, searchScopeType: $Keys<scopeTypes>) => void,
|}>

export type ContainerProps = {|
  onSetTrackedEntityTypeIdOnUrl: ({trackedEntityTypeId: string}) => void
|}

export type Props = {|
  ...CssClasses,
  ...OwnProps,
  ...ContainerProps
|}
