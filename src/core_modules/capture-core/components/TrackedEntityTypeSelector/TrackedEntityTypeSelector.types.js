// @flow
import { typeof scopeTypes } from '../../metaData';

export type OwnProps = $ReadOnly<{|
  accessNeeded?: 'write' | 'read',
  onSelect: (searchScopeId: string, searchScopeType: $Keys<scopeTypes>) => void,
  headerText: string,
  footerText: string,
|}>

export type ContainerProps = {|
  onSetTrackedEntityTypeIdOnUrl: ({trackedEntityTypeId: string}) => void
|}

export type Props = {|
  ...CssClasses,
  ...OwnProps,
  ...ContainerProps
|}
