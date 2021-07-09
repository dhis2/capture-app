// @flow
import type { Node } from 'react';

export type OwnProps = $ReadOnly<{|
  isUserInteractionInProgress?: boolean,
  customActionsOnOrgUnitIdReset?: Array<any>,
  customActionsOnProgramIdReset?: Array<any>,
  pageToPush?: string,
  selectedOrgUnitId: string,
  selectedProgramId: string,
  onSetProgramId: (id: string) => void,
  onResetProgramId: () => void,
  onSetOrgUnit: (id: string, orgUnit: Object) => void,
  onResetOrgUnitId: () => void,
  children: Node,
|}>

export type PropsFromRedux = $ReadOnly<{|
  ready: boolean,
|}>

export type DispatchersFromRedux = $ReadOnly<{|
  onOpenNewEventPage: () => void,
  onOpenNewRegistrationPageWithoutProgramId: Function,
  onOpenSearchPage: () => void,
  onOpenSearchPageWithoutProgramId: () => void,
  onSetCategoryOption: (categoryId: string, categoryOptionId: string) => void,
  onResetCategoryOption: (categoryId: string) => void,
  onResetAllCategoryOptions: () => void,
  onStartAgain: () => void,

|}>


export type Props = {|
  ...OwnProps,
  ...CssClasses,
  ...DispatchersFromRedux,
  ...PropsFromRedux,
  selectedOrgUnit: Object,
  onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
|}


export type State = {|
  openStartAgainWarning: boolean;
  openOrgUnitWarning: boolean;
  openProgramWarning: ?Object;
  openCatComboWarning: boolean;
  categoryIdToReset: string;
  openNewEventWarning: boolean;
|};
