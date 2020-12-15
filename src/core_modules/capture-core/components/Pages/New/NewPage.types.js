// @flow
import { typeof newPageStatuses } from './NewPage.constants';

export type ContainerProps = $ReadOnly<{|
  showMessageToSelectOrgUnitOnNewPage: ()=>void,
  showMessageToSelectProgramPartnerOnNewPage: ()=>void,
  showDefaultViewOnNewPage: ()=>void,
  handleMainPageNavigation: ()=>void,
  currentScopeId: string,
  orgUnitSelectionIncomplete: boolean,
  partnerSelectionIncomplete: boolean,
  newPageStatus: $Keys<newPageStatuses>,
  error: boolean,
  ready: boolean,
|}
>

export type Props = {|
  ...ContainerProps,
  ...CssClasses
|}

