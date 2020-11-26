// @flow
import { typeof newPageStatuses } from './NewPage.constants';

export type ContainerProps = $ReadOnly<{|
  showMessageToSelectOrgUnitOnNewPage: ()=>void,
  showDefaultViewOnNewPage: ()=>void,
  currentOrgUnitId: string,
  currentScopeId: string,
  newPageStatus: $Keys<newPageStatuses>,
  error: boolean,
  ready: boolean,
|}
>

export type Props = {|
  ...ContainerProps,
  ...CssClasses
|}

